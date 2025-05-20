import type { StorybookConfig } from "@storybook/nextjs"
import path from 'node:path'

const config = {
  framework: {
    name: '@storybook/nextjs',
    options: {
      builder: {
        useSWC: true
      }
    }
  },
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y"
  ],
  staticDirs: ['../public'],
  docs: {
    autodocs: true
  },
  core: {
    disableTelemetry: true
  },
  typescript: {
    reactDocgen: false
  },
  webpackFinal: async (config: any) => {
    // Remove default CSS rules
    config.module.rules = config.module.rules.filter((rule: any) => {
      if (rule?.test?.test) {
        return !rule.test.test('.css')
      }
      return true
    })

    // Add our custom CSS rules
    config.module.rules.push({
      test: /\.css$/,
      include: [
        path.resolve(__dirname, '../app'),
        path.resolve(__dirname, '../components'),
        path.resolve(__dirname, './')
      ],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'tailwindcss',
                'autoprefixer'
              ]
            }
          }
        }
      ]
    })

    return config
  }
} satisfies StorybookConfig

export default config