# @jmondi/github-ui

A React component library for displaying GitHub contributors and sponsors with a modern UI.

## Features

- Display GitHub repository contributors
- Show GitHub sponsors for a user
- Responsive and customizable UI
- Built with React and Tailwind CSS
- Efficient data fetching with SWR

## Installation

```bash
npm install @jmondi/github-ui
# or
yarn add @jmondi/github-ui
# or
pnpm add @jmondi/github-ui
```

## Usage

### Contributors Component

```jsx
import { Contributors } from '@jmondi/github-ui/contributors';
import '@jmondi/github-ui/style.css';

function MyComponent() {
  return (
    <Contributors
      owner="facebook"
      repo="react"
      refreshInterval={3600000} // Optional: 1 hour in milliseconds
    />
  );
}
```

### Sponsors Component

```jsx
import { Sponsors } from '@jmondi/github-ui/sponsors';
import '@jmondi/github-ui/style.css';

function MyComponent() {
  return (
    <Sponsors
      username="octocat"
      refreshInterval={3600000} // Optional: 1 hour in milliseconds
    />
  );
}
```

## API

### Contributors Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| owner | string | - | GitHub repository owner |
| repo | string | - | GitHub repository name |
| refreshInterval | number | 3600000 | Data refresh interval in milliseconds |

### Sponsors Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| username | string | - | GitHub username |
| refreshInterval | number | 3600000 | Data refresh interval in milliseconds |

## Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the project: `pnpm build`
4. Format code: `pnpm format`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Would you like me to explain or elaborate on any part of this README?
