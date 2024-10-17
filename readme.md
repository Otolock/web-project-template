
# Web Project Template

A web development project template that uses **TailwindCSS**, **Gulp**, **Nunjucks** for templating, and includes minification of CSS, HTML, and JavaScript. This setup includes separate tasks for development and production builds.

## Features

- **TailwindCSS** for utility-first CSS
- **Nunjucks** templating engine for HTML
- **Gulp** task runner for automation
  - CSS processing with **PostCSS** (autoprefixer, cssnano)
  - HTML and JS minification
  - Sourcemaps generation for development
- **BrowserSync** for live-reloading during development

## Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- [Gulp CLI](https://gulpjs.com/)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/yourusername/web-project-template.git
    cd web-project-template
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

## Project Structure

```bash
.
├── dist              # Output folder for build files
├── gulpfile.js       # Gulp configuration
├── package.json      # Project dependencies and scripts
├── postcss.config.js # TailwindCSS/PostCSS configuration
├── src
│   ├── assets        # Static assets (images, fonts, etc.)
│   ├── css           # Source CSS (Tailwind)
│   ├── js            # JavaScript files
│   ├── templates     # Nunjucks template files
│   │   ├── pages     # Nunjucks pages
│   │   └── layouts   # Layout templates
└── tailwind.config.js
```

## Usage

### Development

To start the development environment with live-reloading, sourcemaps, and non-minified files:

```bash
npm run dev
```

### Build for Production

To create a production build with minified CSS, HTML, and JavaScript:

```bash
npm run build
```

## Gulp Tasks

- **`dev`**: Runs the development environment with live-reloading and sourcemaps.
- **`build`**: Creates a production-ready build with minified CSS, HTML, and JS.
  
## Configuration

### TailwindCSS

You can configure Tailwind in the `tailwind.config.js` file:

```javascript
module.exports = {
    content: ['./src/templates/**/*.njk', './src/js/**/*.js'],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

### Nunjucks

Nunjucks templates are located in the `src/templates` directory. Pages go in the `pages` folder, and shared layouts in the `layouts` folder.

### PostCSS

PostCSS is used for processing TailwindCSS and applying vendor prefixes. The configuration is in `postcss.config.js`:

```javascript
module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
};
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
