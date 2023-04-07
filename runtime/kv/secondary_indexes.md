# Secondary indexes

In key-value stores like Deno KV, data is organized as a collection of key-value
pairs, where each key is unique and associated with a single value. This
structure makes it easy to retrieve values based on their keys, but it does not
allow for querying based on the values themselves. To overcome this constraint,
you can create secondary indexes. These are additional keys storing the same
value, but under a key that includes (part of) that value.

When using secondary indexes, it is very important to maintain consistency
between the values stored at the primary and secondary keys. If a value is
updated at the primary key without updating the secondary key, the data returned
from a query targeting the secondary key would be incorrect. To ensure that the
primary and secondary keys always represent the same data, you must use atomic
operations when inserting, updating, or deleting data. This ensures that the
group of mutation actions are executed as a single unit, and either all succeed
or all fail, preventing these inconsistencies.

## Unique indexes (one-to-one)

Unique indexes are indexes where each key in the index exists exactly once, and
is associated with exactly one primary key.

As an example using unique secondary indexes, let's consider a scenario where
you are storing user data and want to be able to look up users by both their
unique IDs and their email addresses. You can store the user data under two
separate keys: one for the primary key (user ID) and another for the secondary
index (email). This allows you to query the user based on either the ID or the
email.

Here, the secondary index is also used to enforce uniqueness constraints on
values in a key-value store. In the case of our user data example, you can use
this index to ensure that each email address is only associated with one user.
If a user tries to register with an email address that is already in use by a
different user, you can detect this by checking if there is already an entry in
the secondary index for that email address.

If another user tries to register with an email address that is already in use,
you can detect this by checking if there is already an entry in the secondary
index for that email address. If there is, you can reject the new user
registration.

Here's an example of how you can implement this:

1. Create an interface representing a data:

   ```tsx
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

2. Define an `insertUser` function that stores user data at both the primary and
   secondary keys:

   ```tsx
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byEmailKey = ["users_by_email", user.email];
     const res = await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .check({ key: byEmailKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byEmailKey, user)
       .commit();
     if (res === null) {
       throw new TypeError("User with ID or email already exists");
     }
   }
   ```

   This function performs the insert using an atomic operation that checks that
   no user with the same ID or email already exists. If either of these
   constraints is violated, the insert fails and no data is modified.

3. Define a `getUser` function to retrieve a user by their ID:

   ```tsx
   async function getUser(id: string): Promise<User | null> {
     const res = await kv.get(["users", id]);
     return res.value;
   }
   ```

   This function queries the store using the primary key for this user
   (`["users", id]`).

4. Similarly, define a `getUserByEmail` function to retrieve a user by their
   email address:

   ```tsx
   async function getUserByEmail(email: string): Promise<User | null> {
     const res = await kv.get(["users_by_email", email]);
     return res.value;
   }
   ```

   This function queries the store using the secondary key
   (`["users_by_email", email]`).

5. Finally, define a `deleteUser` function to delete users by their ID:

   ```tsx
   async function deleteUser(id: string) {
     let res = null;
     while (res === null) {
       const getRes = await kv.get(["users", id]);
       if (getRes.value === null) return;
       res = await kv.atomic()
         .check(getRes)
         .delete(["users", id])
         .delete(["users_by_email", res.value.email])
         .commit();
     }
   }
   ```

   This function first retrieves the user by their ID to get the users email
   address. This is needed to delete the secondary index containing this email
   address. It then performs an atomic operation that checks that the user in
   the database has not changed, and then deletes both the primary and secondary
   key pointing to the user value. If this fails (the user has been modified
   between query and delete), the atomic operation aborts. This is retried until
   the delete succeeds.

> The `check` operation in the `deleteUser` function is used to ensure that the
> data being deleted has not been modified since it was last read. It adds a
> condition to the atomic operation that verifies the the primary key
> (`["users", id]`) has not been modified since it being initially retrieved
> (`getRes`). If a modification has taken place, the atomic operation will fail,
> and the deletion will not proceed.
>
> This check is important because it helps prevent race conditions that can lead
> to inconsistencies in the data. Race conditions can occur when multiple
> clients or processes are simultaneously accessing and modifying the same data.
> Without the check, the following scenario could occur:
>
> 1. A reads the user object with ID `id1`.
> 2. B reads the same user object with ID `id1`.
> 3. A updates the user object, changing its email address.
> 4. B attempts to delete the user object with ID `id1` without the check.
>
> In this scenario, if B proceeds to delete the user object without the check,
> it would delete the primary key (`["users", id1]`) and the old secondary key
> (`["users_by_email", old_email]`) while the new secondary key
> (`["users_by_email", new_email]`) would still be present in the store. This
> would result in an inconsistency because deleted user object could still be
> accessed through the new secondary key (but not the primary key).
>
> By using the `check` operation, we ensure that if the user object has been
> modified since it was last read (e.g., the email has been updated), the
> deletion will not proceed, preventing inconsistencies. In this case, the
> `deleteUser` function will loop and attempt the deletion again, ensuring that
> it has the latest user object before deleting both the primary and secondary
> keys. The atomic operation guarantees that all operations in the sequence
> (check, delete primary key, and delete secondary key) are executed as a single
> unit, either all succeed or all fail, thus avoiding these inconsistencies.

## Non-unique indexes (one-to-many)

Non-unique indexes are secondary indexes where a single key can be associated
with multiple primary keys, allowing you to query for multiple items based on a
shared attribute.

For instance, consider a scenario where you want to query users by their
favorite color. Here, the favorite color is a non-unique attribute, as multiple
users can have the same favorite color. You can implement this using a
non-unique secondary index.

Example:

1. Define the `User` interface:

   ```ts
   interface User {
     id: string;
     name: string;
     email: string;
     favoriteColor: string;
   }
   ```

2. Create the `insertUser` function:
   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byColorKey = [
       "users_by_favorite_color",
       user.favoriteColor,
       user.id,
     ];
     await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byColorKey, user)
       .commit();
   }
   ```

3. Define a function to retrieve users by their favorite color:

   ```ts
   async function getUsersByFavoriteColor(color: string): Promise<User[]> {
     const iter = kv.list({ prefix: ["users_by_favorite_color", color] });
     const users = [];
     for await (const { value } of iter) {
       users.push(value);
     }
     return users;
   }
   ```

This example demonstrates the use of a non-unique secondary index,
`users_by_favorite_color`, which allows you to query users based on their
favorite color. The primary key remains the user `id`.

The primary difference between the implementation of unique and non-unique
indexes lies in the structure and organization of the secondary keys. In unique
indexes, each secondary key is associated with exactly one primary key, ensuring
that the indexed attribute is unique across all records. In the case of
non-unique indexes, a single secondary key can be associated with multiple
primary keys, as the indexed attribute may be shared among multiple records. To
achieve this, non-unique secondary keys are typically structured with an
additional unique identifier (e.g., primary key) as part of the key, allowing
multiple records with the same attribute to coexist without conflicts.
