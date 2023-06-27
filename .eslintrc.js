module.exports = {
    env: {
        browser: true,
        es6: true,
        node: false,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/typescript',
        'plugin:import/warnings',
        'plugin:jsdoc/recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['@typescript-eslint', 'jsdoc', 'prettier'],
    rules: {
        indent: ['error', 4],
        'jsdoc/require-description': [
            1,
            {
                contexts: ['any'],
            },
        ],
        'jsdoc/require-description-complete-sentence': 1,
        'jsdoc/require-jsdoc': [
            1,
            {
                require: {
                    ArrowFunctionExpression: true,
                    ClassDeclaration: true,
                    ClassExpression: true,
                    FunctionDeclaration: true,
                    FunctionExpression: true,
                    MethodDefinition: true,
                },
                contexts: [
                    'TSClassProperty',
                    'TSDeclareFunction',
                    'TSEmptyBodyFunctionExpression',
                    'TSEnumDeclaration',
                    'TSInterfaceDeclaration',
                    'TSMethodSignature',
                    'TSPropertySignature',
                    'TSTypeAliasDeclaration',
                ],
            },
        ],
        'linebreak-style': ['error', 'unix'],
        'prettier/prettier': 'error',
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
    },
};
