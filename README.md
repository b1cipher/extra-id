# Extra ID

**Create separate identities. Sign up faster. Keep your personal details to yourself.**

Extra ID is a browser extension that helps you create separate profiles for websites where you don't want to share your primary personal information.

Instead of repeatedly coming up with usernames, passwords, and email addresses, you can generate a profile and use it when signing up for a new service.

## Features

- **Quick profile generation** — generate usernames and personal details for new accounts.
- **Temporary email** — create and use temporary email addresses through [Mail.tm](https://mail.tm/).
- **Password generation** — generate strong, random passwords for website accounts.
- **Password management** — keep generated credentials associated with their respective websites.
- **Form assistance** — quickly fill supported registration forms.
- **Multiple identities** — maintain separate profiles for different websites and services.
- **Localization** — interface translations are provided through the extension's localization files.

## Why Extra ID?

Not every website deserves your real email address or personal information.

Extra ID makes it easier to:
- Register on websites you only need once.
- Keep accounts for miscellaneous services separate from your main identity.
- Avoid reusing the same username and password everywhere.
- Reduce the amount of personal information you share during registration.

## Privacy & Security

Extra ID is designed to help users minimize the personal information they disclose when registering for online services.

Please keep the following limitations in mind:

- Temporary email functionality relies on the third-party Mail.tm service. Mail.tm may process connection metadata, including your IP address.
- Browser-stored data is not protected against someone who already has access to your browser profile or device.
- Exported JSON backups contain sensitive information and should be stored securely.
- Using separate profiles does not guarantee anonymity. Websites may still identify or associate users through IP addresses, cookies, browser fingerprinting, payment information, and other signals.

Read our [Privacy Policy](https://b1cipher.github.io/extra-id/).

## Installation

Install Extra ID from your browser's extension store when an official release is available.

For development or manual installation:

1. Download or clone this repository.
2. Open your browser's extension management page.
3. Enable Developer Mode.
4. Load the extension's built distribution folder as an unpacked extension.

## Building from Source

The project includes a build script for generating browser-specific packages.

```bash
./scripts/build.sh
```

The script checks manifest versions, prepares distribution directories, and creates ZIP packages.

Run the script from the project directory containing `scripts/build.sh`.

## Project Structure

- `src/` — extension source code, interface, background scripts, and localization.
- `manifests/` — browser-specific extension manifests.
- `scripts/` — build utilities.
- `docs/` — project documentation and privacy policy.
- `dist/` — generated distribution packages.

## Compatibility

Extra ID uses the WebExtensions platform and Manifest V3.

Compatibility depends on the browser-specific manifest and the APIs supported by the target browser. Check the relevant release package before installation.

## Contributing

Bug reports, suggestions, and improvements are welcome.

If you find an issue, please open a GitHub Issue with:
- A description of the problem.
- Steps to reproduce it.
- Your browser and version.
- Relevant error messages, if available.

## Disclaimer

Extra ID is an independent browser extension. It is not affiliated with or endorsed by the websites and services used through it, including Mail.tm.

**Use generated identities responsibly and follow the terms of service of the websites you visit.**
