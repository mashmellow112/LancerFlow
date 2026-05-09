# Security Specification - LancerFlow Waitlist

## 1. Data Invariants
- A waitlist entry must contain a valid email address.
- A waitlist entry must have a `createdAt` timestamp exactly matching the server request time.
- Users cannot read other people's waitlist entries.
- Users cannot update or delete entries once submitted.

## 2. The "Dirty Dozen" Payloads
1. **Email Spoofing**: Attempt to create an entry with an invalid email format.
2. **Identity Theft**: Attempt to read the entire `waitlist` collection.
3. **Timestamp Manipulation**: Attempt to set `createdAt` to a past or future date.
4. **Shadow Fields**: Attempt to add an `isAdmin: true` field to the entry.
5. **Update Attack**: Attempt to change the email of an existing entry.
6. **Deletion Attack**: Attempt to delete an existing entry.
7. **Resource Poisoning**: Use a 2MB string as the email.
8. **ID Injection**: Use a malicious script tag as the document ID.
9. **Null Poisoning**: Send `null` for the `email` field.
10. **Type Mismatch**: Send an array instead of a string for `email`.
11. **Bulk Creation**: (Handled by quotas, but rules should ensure one-at-a-time creation logic is sound).
12. **Missing Required Fields**: Attempt to create an entry without `email` or `createdAt`.

## 3. Test Runner
(Will be implemented in `firestore.rules.test.ts` if needed, but for now we focus on the rules).
