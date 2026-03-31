export type LegacyAssetKind = 'css' | 'js';

export type LegacyAsset = {
  kind: LegacyAssetKind;
  href: string;
  id?: string;
};

export type LegacyBundleName =
  | 'base-css'
  | 'base-js'
  | 'header-css'
  | 'header-js'
  | 'blog-single-css'
  | 'blog-archive-css'
  | 'cookie-js'
  | 'analytics-js';

const css = (href: string, id?: string): LegacyAsset => ({ kind: 'css', href, id });
const js = (href: string, id?: string): LegacyAsset => ({ kind: 'js', href, id });

export const legacyBundles: Record<LegacyBundleName, LegacyAsset[]> = {
  'base-css': [
    css('/wp-content/themes/astra/assets/css/minified/style-flex.min.css', 'astra-theme-css'),
    css('/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/legacy-list-horizontal/style.min.css', 'wpml-legacy-horizontal-css'),
    css('/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/menu-item/style.min.css', 'wpml-menu-item-css'),
    css('/wp-content/plugins/wpml-cms-nav/res/css/cms-navigation-base.css', 'wpml-cms-navigation-base-css'),
    css('/wp-content/plugins/wpml-cms-nav/res/css/cms-navigation.css', 'wpml-cms-navigation-css'),
    css('/wp-content/plugins/elementor/assets/css/frontend.min.css', 'elementor-frontend-css'),
    css('/wp-content/plugins/elementor/assets/css/widget-image.min.css', 'elementor-widget-image-css'),
    css('/wp-content/plugins/elementor/assets/css/widget-heading.min.css', 'elementor-widget-heading-css'),
    css('/wp-content/plugins/elementor/assets/css/widget-social-icons.min.css', 'elementor-widget-social-icons-css'),
    css('/wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css', 'elementor-apple-webkit-css'),
    css('/wp-content/plugins/elementor/assets/lib/font-awesome/css/all.min.css', 'font-awesome-all-css'),
    css('/wp-content/plugins/elementor/assets/lib/font-awesome/css/v4-shims.min.css', 'font-awesome-v4-shims-css'),
    css('/wp-content/uploads/elementor/google-fonts/css/lato.css', 'elementor-google-font-lato-css'),
    css('/wp-content/uploads/elementor/google-fonts/css/varelaround.css', 'elementor-google-font-varelaround-css'),
  ],
  'base-js': [
    js('/wp-includes/js/jquery/jquery.min.js', 'jquery-core-js'),
    js('/wp-includes/js/jquery/jquery-migrate.min.js', 'jquery-migrate-js'),
    js('/wp-content/plugins/elementor/assets/lib/font-awesome/js/v4-shims.min.js', 'font-awesome-4-shim-js'),
    js('/wp-content/themes/astra/assets/js/minified/style.min.js', 'astra-theme-js'),
    js('/wp-includes/js/jquery/ui/core.min.js', 'jquery-ui-core-js'),
    js('/wp-includes/js/jquery/ui/mouse.min.js', 'jquery-ui-mouse-js'),
    js('/wp-includes/js/jquery/ui/slider.min.js', 'jquery-ui-slider-js'),
    js('/wp-includes/js/jquery/ui/draggable.min.js', 'jquery-ui-draggable-js'),
    js('/wp-includes/js/jquery/jquery.ui.touch-punch.js', 'jquery-touch-punch-js'),
    js('/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js', 'elementor-webpack-runtime-js'),
    js('/wp-content/plugins/elementor/assets/js/frontend-modules.min.js', 'elementor-frontend-modules-js'),
    js('/wp-content/plugins/elementor/assets/js/frontend.min.js', 'elementor-frontend-js'),
    js('/wp-includes/js/imagesloaded.min.js', 'imagesloaded-js'),
    js('/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js', 'elementor-pro-webpack-runtime-js'),
    js('/wp-includes/js/dist/hooks.min.js', 'wp-hooks-js'),
    js('/wp-includes/js/dist/i18n.min.js', 'wp-i18n-js'),
    js('/wp-content/plugins/elementor-pro/assets/js/frontend.min.js', 'elementor-pro-frontend-js'),
    js('/wp-content/plugins/elementor-pro/assets/js/elements-handlers.min.js', 'pro-elements-handlers-js'),
  ],
  'header-css': [
    css('/wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css', 'elementor-pro-widget-mega-menu-css'),
    css('/wp-content/plugins/elementor-pro/assets/css/widget-nav-menu.min.css', 'elementor-pro-widget-nav-menu-css'),
    css('/wp-content/plugins/elementor-pro/assets/css/modules/sticky.min.css', 'elementor-pro-sticky-css'),
    css('/wp-content/plugins/elementor/assets/lib/animations/styles/fadeIn.min.css', 'elementor-fadein-css'),
    css('/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-shrink.min.css', 'elementor-shrink-css'),
    css('/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css', 'elementor-grow-css'),
  ],
  'header-js': [
    js('/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js', 'smartmenus-js'),
    js('/wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js', 'e-sticky-js'),
  ],
  'blog-single-css': [
    css('/wp-content/plugins/elementor-pro/assets/css/widget-post-info.min.css', 'elementor-pro-widget-post-info-css'),
    css('/wp-content/plugins/elementor/assets/css/widget-icon-list.min.css', 'elementor-widget-icon-list-css'),
  ],
  'blog-archive-css': [
    css('/wp-includes/css/dist/block-library/style.min.css', 'wp-block-library-css'),
  ],
  'cookie-js': [
    js('/wp-content/plugins/cookie-law-info/lite/frontend/js/script.min.js', 'cookie-law-info-js'),
  ],
  'analytics-js': [],
};

export const legacyShells = {
  es: {
    headerId: '9642',
    footerId: '31645',
  },
  en: {
    headerId: '10265',
    footerId: '31753',
  },
} as const;

export function getLegacyBundle(...bundleNames: LegacyBundleName[]): LegacyAsset[] {
  return bundleNames.flatMap((bundleName) => legacyBundles[bundleName]);
}
