import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const components = readdirSync(
    join(fileURLToPath(new URL('../components', import.meta.url)))
).map((name) => {
    return {
        __name: name.replace(/\.vue$/, ''),
    };
});

/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
    vite: {
        resolve: {
            alias: components.map((component) => {
                return {
                    find: new RegExp(`^.*\\/${component.__name}\\.vue$`),
                    replacement: fileURLToPath(
                        new URL(
                            `../components/${component.__name}.vue`,
                            import.meta.url
                        )
                    ),
                };
            }),
        },
    },
    themeConfig: {
        siteTitle: 'VitePress BlogMate',
        search: {
            provider: 'local',
        },
    },
};

export default config;
