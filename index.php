<?php
$page = empty( $_GET['page'] ) ? 'promotion' : strtolower( $_GET['page'] );
$menu = [
	'promotion'   => 'Promotion',
	'tickets'     => 'Tickets',
	'attractions' => 'Attractions',
	'financial'   => 'Financial Report',
	'about'       => 'About Company',
	'careers'     => 'Careers',
	'news'        => 'Events & News',
];
if ( ! array_key_exists( $page, $menu ) ) {
	header( 'Location: /' );
	exit;
}
$menu_html = '';
foreach ( $menu as $k => $v ) {
	$menu_html .= '<li' . ( $page == $k ? ' class="active"' : '' ) . '><a href="?page=' . $k . '">' . $v . '</a></li>';
}
$layout  = file_get_contents( 'html/layout.html' );
$content = file_get_contents( 'html/content/' . $page . '.html' );
$layout  = str_replace( '{{ menu }}', $menu_html, $layout );
$layout  = str_replace( '{{ content }}', $content, $layout );
echo $layout;