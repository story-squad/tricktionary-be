module.exports = {
  plugins: [
    [
      "docusaurus-plugin-typedoc",

      // Plugin / TypeDoc options
      {
        entryPoints: ["../src/index.ts"],
        tsconfig: "../tsconfig.json"
      }
    ]
  ],
  title: "Tricktionary",
  tagline: "the fun docs",
  url: "https://dev.tricktionary.monster",
  baseUrl: "/help/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "storysquad", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "T. rex",
      logo: {
        alt: "Tricktionary",
        src: "img/logo.svg"
      },
      items: [
        {
          to: "docs/tricktionary/README",
          label: "Docs",
          position: "left"
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/story-squad/tricktionary-be",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              to: 'docs/tricktionary/README',
              label: 'Tricktionary',
              position: 'left'
            },
            {
              to: 'docs/',
              label: 'Style',
              position: 'left',
            }
          ]
        },
        {
          title: "Community",
          items: [
            {
              label: "Story Squad",
              href: "https://storysquad.app"
            },
            {
              label: "Tricktionary",
              href: "https://tricktionary.storysquad.app/"
            },
            {
              label: "Product Hunt",
              href: "https://www.producthunt.com/@story_hq"
            }
          ]
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog"
            },
            {
              label: "GitHub",
              href: "https://github.com/story-squad/tricktionary-be"
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StorySquad, Built with Docusaurus.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // editUrl: "https://github.com/story-squad/tricktionary-be/trex"
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/story-squad/tricktionary-be/tree/main/trex"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};
