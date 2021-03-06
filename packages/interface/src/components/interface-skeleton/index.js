/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { navigateRegions } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function useHTMLClass( className ) {
	useEffect( () => {
		const element =
			document && document.querySelector( `html:not(.${ className })` );
		if ( ! element ) {
			return;
		}
		element.classList.toggle( className );
		return () => {
			element.classList.toggle( className );
		};
	}, [ className ] );
}

function InterfaceSkeleton( {
	footer,
	header,
	sidebar,
	content,
	actions,
	labels,
	className,
} ) {
	useHTMLClass( 'interface-interface-skeleton__html-container' );

	const defaultLabels = {
		header: __( 'Header' ),
		body: __( 'Content' ),
		sidebar: __( 'Settings' ),
		actions: __( 'Publish' ),
		footer: __( 'Footer' ),
	};

	const mergedLabels = { ...defaultLabels, ...labels };

	return (
		<div
			className={ classnames(
				className,
				'interface-interface-skeleton'
			) }
		>
			{ !! header && (
				<div
					className="interface-interface-skeleton__header"
					role="region"
					/* translators: accessibility text for the top bar landmark region. */
					aria-label={ mergedLabels.header }
					tabIndex="-1"
				>
					{ header }
				</div>
			) }
			<div className="interface-interface-skeleton__body">
				<div
					className="interface-interface-skeleton__content"
					role="region"
					/* translators: accessibility text for the content landmark region. */
					aria-label={ mergedLabels.body }
					tabIndex="-1"
				>
					{ content }
				</div>
				{ !! sidebar && (
					<div
						className="interface-interface-skeleton__sidebar"
						role="region"
						/* translators: accessibility text for the settings landmark region. */
						aria-label={ mergedLabels.sidebar }
						tabIndex="-1"
					>
						{ sidebar }
					</div>
				) }
				{ !! actions && (
					<div
						className="interface-interface-skeleton__actions"
						role="region"
						/* translators: accessibility text for the publish landmark region. */
						aria-label={ mergedLabels.actions }
						tabIndex="-1"
					>
						{ actions }
					</div>
				) }
			</div>
			{ !! footer && (
				<div
					className="interface-interface-skeleton__footer"
					role="region"
					/* translators: accessibility text for the footer landmark region. */
					aria-label={ mergedLabels.footer }
					tabIndex="-1"
				>
					{ footer }
				</div>
			) }
		</div>
	);
}

export default navigateRegions( InterfaceSkeleton );
