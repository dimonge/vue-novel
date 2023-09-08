# Vue Novel

Vue Novel is an open-source plugin inspired by Novel that brings an AI-powered editor to any Vue or NuxtJS based web application. It offers various features and functionalities to enhance the content creation and editing experience. You can also use the example Nuxtjs project as the based for your project

## Installation

To install Vue Novel, you can use npm:

```
npm install vue-novel
```

## Usage

You can register the Novel plugin in your app's root

```js
import { VueNovelPlugin } from 'vue-novel'
app.use(VueNovelPlugin)
```

or you can import Vue Novel into your Vue components like this:

```js
import { VueNovel } from 'vue-novel'

export default {
  components: {
    VueNovel
  }
  // ...
}
```

Then, you can use the `vue-novel` component in your template:

```html
<template>
  <div>
    <vue-novel />
  </div>
</template>
```

## Features

Vue Novel offers the following features:

- **WYSIWYG Editor**: A user-friendly editor that allows you to create and edit content easily.
- **Markdown Support**: Support for writing content in Markdown format.
- **Syntax Highlighting**: Support for code hightlighting.
- **AI: Completion**: Support for Text completion
- **Document Versioning**: TBD.
- **Export Options**: TBD.
- **Real-time collaboration**: TBD

## Contributing

Contributions to Vue Novel are welcome! If you have any ideas, bug reports, or feature requests, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/your-github-repo).

Before contributing, please make sure to read the [contribution guidelines](CONTRIBUTING.md).

## License

Vue Novel is open-source software licensed under the [MIT License](LICENSE).

## Acknowledgements

Vue Novel is built on top of some amazing open-source projects and AI technologies. We would like to express our gratitude to the developers and contributors of these projects.

## Contact

If you have any questions or need support, you can reach us through the following channels:

- Issues: If you encounter any bugs or have feature requests, please submit an issue on the [GitHub repository](https://github.com/your-github-repo/issues).
- Email: You can also reach out to us via email at [info@thevinelabs.com](mailto:info@thevinelabs.com).
- Discord: Join our community Discord server at [discord.gg/novelvue](https://discord.gg/novelvue) to connect with other users and get help.

We appreciate your interest and contributions to Vue Novel. Happy writing and editing!
