/**
 * ES module entry point for SocialShareButton.
 *
 * social-share-button.js is also served directly to browsers as a classic
 * <script> tag from the CDN, so it cannot contain `export` syntax. This file
 * is the module entry instead, and simply re-exports the class from it.
 */
import SocialShareButton from "./social-share-button.js";

export default SocialShareButton;
export { SocialShareButton };
