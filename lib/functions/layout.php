<?php
/**
 * Layouts handler.
 *
 * @package     SB2\Developers
 * @since       1.0.0
 * @author      sbarry50
 * @link        https://sb2media.com
 * @license     GNU General Public License 2.0+
 */

namespace SB2\Inizio;

/**
 * Unregisters soecified layouts from default Genesis framework
 *
 * @since 1.0.0
 *
 * @return void
 */
function unregister_layout_callbacks() {

	$layouts = array(
		'content-sidebar-sidebar',
		'sidebar-content-sidebar',
		'sidebar-sidebar-content'
	);

	foreach( $layouts as $layout ) {
		genesis_unregister_layout( $layout );
	}
}