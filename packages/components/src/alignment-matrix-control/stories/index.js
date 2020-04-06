/**
 * External dependencies
 */
import { boolean, number, select } from '@storybook/addon-knobs';
/**
 * WordPress dependencies
 */
import { Icon as BaseIcon } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import AlignmentMatrixControl from '../';
import { ALIGNMENTS } from '../utils';

const alignmentOptions = ALIGNMENTS.reduce( ( options, item ) => {
	return { ...options, [ item ]: item };
}, {} );

export default {
	title: 'Components/AlignmentMatrixControl',
	component: AlignmentMatrixControl,
};

export const _default = () => {
	const props = {
		hasFocusBorder: boolean( 'hasFocusBorder', true ),
		value: select( 'value', alignmentOptions, 'center center' ),
	};

	return <AlignmentMatrixControl { ...props } />;
};

export const icon = () => {
	const props = {
		value: select( 'value', alignmentOptions, 'center center' ),
		size: number( 'size', 24 ),
	};

	return <BaseIcon icon={ AlignmentMatrixControl.icon } { ...props } />;
};