/**
 * External dependencies
 */
import { noop } from 'lodash';
import { useRadioState, Radio, RadioGroup } from 'reakit/Radio';
import styled from '@emotion/styled';
/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import ButtonGroup from '../button-group';
import Button from '../button';
import BoxControlIcon from './icon';
import BaseUnitControl from '../unit-control';
import { Flex, FlexBlock, FlexItem } from '../flex';

const types = [ 'all', 'pairs', 'custom' ];
const defaultInputProps = {
	min: 0,
};
const typeIconSides = {
	all: [ 'all' ],
	pairs: [ 'top', 'bottom' ],
	custom: [ 'top' ],
};

const defaultValueProps = {
	top: [ 0, 'px' ],
	right: [ 0, 'px' ],
	bottom: [ 0, 'px' ],
	left: [ 0, 'px' ],
};

const BoxControlComponent = {
	all: BoxAllControl,
	pairs: BoxPairsControl,
	custom: BoxCustomControl,
};

const parseType = ( type ) => {
	return types.includes( type ) ? type : 'all';
};

export default function BoxControl( {
	inputProps = defaultInputProps,
	onChange = noop,
	label = 'Box Control',
	type: typeProp = 'pairs',
	values: valuesProp,
	// Disable units for now
	units = false,
} ) {
	const [ type, setType ] = useState( parseType( typeProp ) );
	const [ values, setValues ] = useState( parseValues( valuesProp ) );
	const ControlComponent = BoxControlComponent[ type ];

	const updateValues = ( nextValues ) => {
		const mergedValues = { ...values, ...nextValues };
		setValues( mergedValues );
		onChange( mergedValues );
	};

	const mixedLabel = __( 'Mixed' );

	return (
		<Root>
			<Header>
				<FlexItem>{ label }</FlexItem>
				<FlexItem>
					<BoxTypeControl
						label={ label }
						onChange={ setType }
						type={ type }
					/>
				</FlexItem>
			</Header>
			<ControlComponent
				{ ...inputProps }
				placeholder={ mixedLabel }
				values={ values }
				onChange={ updateValues }
				units={ units }
			/>
		</Root>
	);
}

function BoxAllControl( { placeholder, onChange = noop, values, ...props } ) {
	const [ value, unit ] = values.top;
	const allValues = getValues( values, 'top', 'right', 'bottom', 'left' );
	const isMixed = ! allValues.every( ( v ) => v === value );

	return (
		<ControlContainer>
			<FlexItem>
				<BoxControlIcon />
			</FlexItem>
			<FlexBlock>
				<UnitControl
					{ ...props }
					value={ isMixed ? '' : value }
					placeholder={ placeholder }
					unit={ unit }
					onChange={ ( next ) => {
						onChange( {
							top: [ next, unit ],
							right: [ next, unit ],
							bottom: [ next, unit ],
							left: [ next, unit ],
						} );
					} }
					onUnitChange={ ( next ) => {
						onChange( {
							top: [ value, next ],
							right: [ value, next ],
							bottom: [ value, next ],
							left: [ value, next ],
						} );
					} }
				/>
			</FlexBlock>
		</ControlContainer>
	);
}

function BoxPairsControl( { placeholder, onChange = noop, values, ...props } ) {
	const [ selected, setSelected ] = useState( 'vertical' );
	const [ vertical, verticalUnit ] = values.top;
	const [ horizontal, horizontalUnit ] = values.left;

	const isVerticalMixed = ! getValues( values, 'top', 'bottom' ).every(
		( v ) => v === vertical
	);
	const isHorizontalMixed = ! getValues( values, 'left', 'right' ).every(
		( v ) => v === horizontal
	);

	const iconSides = {
		vertical: [ 'top', 'bottom' ],
		horizontal: [ 'left', 'right' ],
	};

	const iconSide = iconSides[ selected ];

	return (
		<ControlContainer>
			<BoxControlIcon sides={ iconSide } />
			<UnitControl
				{ ...props }
				placeholder={ placeholder }
				onFocus={ () => setSelected( 'vertical' ) }
				onChange={ ( next ) => {
					onChange( {
						top: [ next, verticalUnit ],
						bottom: [ next, verticalUnit ],
					} );
				} }
				onUnitChange={ ( next ) => {
					onChange( {
						top: [ vertical, next ],
						bottom: [ vertical, next ],
					} );
				} }
				value={ isVerticalMixed ? '' : vertical }
				unit={ verticalUnit }
			/>
			<UnitControl
				{ ...props }
				placeholder={ placeholder }
				onFocus={ () => setSelected( 'horizontal' ) }
				onChange={ ( next ) => {
					onChange( {
						left: [ next, horizontalUnit ],
						right: [ next, horizontalUnit ],
					} );
				} }
				onUnitChange={ ( next ) => {
					onChange( {
						left: [ horizontal, next ],
						right: [ horizontal, next ],
					} );
				} }
				value={ isHorizontalMixed ? '' : horizontal }
				unit={ horizontalUnit }
			/>
		</ControlContainer>
	);
}

function BoxCustomControl( { onChange = noop, values, ...props } ) {
	const [ selected, setSelected ] = useState( 'top' );
	const unitControlProps = useCustomUnitControlProps( {
		values,
		onChange,
	} );

	return (
		<ControlContainer>
			<FlexItem>
				<BoxControlIcon sides={ [ selected ] } />
			</FlexItem>
			<ControlContainer>
				<UnitControl
					{ ...unitControlProps.top }
					{ ...props }
					onFocus={ () => setSelected( 'top' ) }
					placeholder=""
				/>
				<UnitControl
					{ ...unitControlProps.right }
					{ ...props }
					onFocus={ () => setSelected( 'right' ) }
					placeholder=""
				/>
				<UnitControl
					{ ...unitControlProps.bottom }
					{ ...props }
					onFocus={ () => setSelected( 'bottom' ) }
					placeholder=""
				/>
				<UnitControl
					{ ...unitControlProps.left }
					{ ...props }
					onFocus={ () => setSelected( 'left' ) }
					placeholder=""
				/>
			</ControlContainer>
		</ControlContainer>
	);
}

function ControlContainer( { children } ) {
	return (
		<Flex justify="left" gap={ 1 }>
			{ children }
		</Flex>
	);
}

function useCustomUnitControlProps( { values, onChange = noop } ) {
	const valueKeys = Object.keys( values );
	const props = {};

	valueKeys.forEach( ( key ) => {
		const [ value, unit ] = values[ key ];

		const handleOnChange = ( next ) => {
			onChange( { [ key ]: [ next, unit ] } );
		};

		const handleOnUnitChange = ( next ) => {
			onChange( { [ key ]: [ value, next ] } );
		};

		props[ key ] = {
			value,
			unit,
			onChange: handleOnChange,
			onUnitChange: handleOnUnitChange,
		};
	} );

	return props;
}

function BoxTypeControl( {
	label = 'Box Control',
	onChange = noop,
	type = 'all',
} ) {
	const radio = useRadioState( { state: type } );

	useEffect( () => {
		onChange( radio.state );
	}, [ radio.state ] );

	return (
		<RadioGroup { ...radio } as={ ButtonGroup } aria-label={ label }>
			{ types.map( ( value ) => (
				<Radio
					{ ...radio }
					as={ Button }
					isPrimary={ radio.state === value }
					key={ value }
					value={ value }
				>
					<BoxControlIcon sides={ typeIconSides[ value ] } />
				</Radio>
			) ) }
		</RadioGroup>
	);
}

function UnitControl( props ) {
	return (
		<UnitControlWrapper>
			<BaseUnitControl isResetValueOnUnitChange={ false } { ...props } />
		</UnitControlWrapper>
	);
}

const Root = styled.div`
	max-width: 400px;
`;

const Header = styled( Flex )`
	margin-bottom: 8px;
`;

const UnitControlWrapper = styled.div`
	box-sizing: border-box;
	max-width: 80px;
`;

function parseValues( values = {} ) {
	const nextValueProps = {};

	Object.keys( defaultValueProps ).forEach( ( key ) => {
		const defaultValue = defaultValueProps[ key ];
		const prop = values[ key ] || [];

		nextValueProps[ key ] = [
			prop?.[ 0 ] || defaultValue[ 0 ],
			prop?.[ 1 ] || defaultValue[ 1 ],
		];
	} );

	return nextValueProps;
}

function getValues( values, ...args ) {
	const nextValues = [];
	args.forEach( ( key ) => {
		nextValues.push( values[ key ][ 0 ] );
	} );

	return nextValues;
}
