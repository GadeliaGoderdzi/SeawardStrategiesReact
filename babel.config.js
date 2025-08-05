module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: [
            '>0.2%',
            'not dead',
            'not ie <= 11',
            'not op_mini all'
          ]
        },
        useBuiltIns: 'entry',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ],
        '@babel/preset-react'
      ]
    },
    production: {
      plugins: [
        'transform-remove-console'
      ]
    }
  }
};
