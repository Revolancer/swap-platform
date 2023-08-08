# Revolancer Platform

This is the Next.js web frontend for the Revolancer platform. Copyright 2021-2023 Revolancer Ltd, all rights reserved.

## Contributing

In order to contribute to this codebase, you should start a Github Codespace within this repository.
It is recommended that you also start a codespace within [https://github.com/Revolancer/api](https://github.com/Revolancer/api) in order to test any changes to API endpoints. If you do so, create a file at `.env.local` with the following format:

```sh
NEXT_PUBLIC_API_HOST=http://localhost:3030/ # Replace with the address and port exposed by your API codespace
```

When starting a new codespace, an admin account should be seeded with the following credentials:

```plaintext
Username: admin@revolancer.com
Password: Password1!
```

If these details do not work, you may need to manually seed the database; you can do so by running the following command within the API codespace:

```sh
npm run seed:refresh
```

### Pull Requests

When opening a pull request, please conform to the template provided, providing links to any Linear issues resolved by your PR. Once your PR is ready for review, please request a review from @Flickwire.
