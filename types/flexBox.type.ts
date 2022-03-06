import {CSSObject} from 'styled-components';

type ViewStyle = CSSObject;

type TextStyle = ViewStyle;

type ObjFromTuple<
	T extends string,
	S extends string = '',
	Type = boolean,
	Separator extends string = '-',
> = KeysToCamelCase<Separator, Record<ToString<T, S>, Type>>;
type KeysToCamelCase<S extends string, T> = {
	[K in keyof T as CamelCase<S, string & K>]: T[K] extends {}
		? KeysToCamelCase<S, T[K]>
		: T[K];
};
type ToString<R extends string, L extends string = ''> = `${L}${R}`;
type CamelCase<
	Separator extends string,
	S extends string,
> = S extends `${infer P1}${Separator}${infer P2}${infer P3}`
	? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<Separator, P3>}`
	: Lowercase<S>;

export type Align = {
	align?: TextStyle['textAlign'];
} & Partial<
	ObjFromTuple<'auto' | 'left' | 'center' | 'right' | 'justify', 'align-'>
>;
export type VAlign = {
	vAlign?: TextStyle['verticalAlign'];
} & Partial<ObjFromTuple<'auto' | 'top' | 'center' | 'bottom', 'v-align-'>>;
export type Justify = {
	justify?: ViewStyle['justifyContent'];
} & Partial<
	ObjFromTuple<
		'center' | 'end' | 'start' | 'around' | 'between' | 'evenly',
		'justify-'
	>
>;
export type Items = {
	items?: ViewStyle['alignItems'];
} & Partial<
	ObjFromTuple<'baseline' | 'center' | 'end' | 'start' | 'stretch', 'items-'>
>;
export type Content = {
	content?: ViewStyle['alignContent'];
} & Partial<
	ObjFromTuple<
		'center' | 'end' | 'start' | 'around' | 'between' | 'stretch',
		'content-'
	>
>;
export type Self = {
	self?: ViewStyle['alignSelf'];
} & Partial<
	ObjFromTuple<'auto' | 'start' | 'end' | 'center' | 'stretch', 'self-'>
>;
export type Position = Partial<ObjFromTuple<'relative' | 'absolute'>> &
	Partial<
		ObjFromTuple<
			'z-index' | 'radius' | 'top' | 'right' | 'bottom' | 'left',
			'',
			number
		>
	>;
export type Flex = Partial<ObjFromTuple<'row' | 'col' | 'reverse'>> & {
	flex?: boolean | number;
	wrap?: ViewStyle['flexWrap'] | boolean;
	direction?: ViewStyle['flexDirection'];
};
export type Size = {
	height?: ViewStyle['height'];
	width?: ViewStyle['width'];
};
export type TextAlign = Align & VAlign;
export type FlexBox = Position & Flex & Items & Content & Justify & Self & Size;

type FlexAll = Position &
	Flex &
	Items &
	Content &
	Justify &
	Self &
	TextAlign &
	Size;

export const getFlexBox = <D extends FlexAll>(props: D) => {
	const {
		width,
		height,
		direction,
		flex,
		reverse,
		wrap,
		col,
		row,
		absolute,
		relative,
		zIndex,
		radius,
		top,
		left,
		right,
		bottom,
		content,
		contentCenter,
		contentEnd,
		contentStart,
		contentAround,
		contentBetween,
		contentStretch,
		items,
		itemsBaseline,
		itemsCenter,
		itemsEnd,
		itemsStart,
		itemsStretch,
		justify,
		justifyCenter,
		justifyEnd,
		justifyStart,
		justifyAround,
		justifyBetween,
		justifyEvenly,
		self,
		selfAuto,
		selfCenter,
		selfEnd,
		selfStart,
		selfStretch,
		align,
		alignAuto,
		alignLeft,
		alignRight,
		alignJustify,
		alignCenter,
		vAlign,
		vAlignAuto,
		vAlignTop,
		vAlignBottom,
		vAlignCenter,
		...rest
	} = props;
	return {
		restProps: rest,
		flexBoxStyleProps: {
			width,
			height,
			zIndex,
			top,
			left,
			right,
			bottom,
			flexWrap: typeof wrap === 'boolean' ? (wrap ? 'wrap' : undefined) : wrap,
			borderRadius: radius,
			get textAlign() {
				if (align) return align;
				if (alignAuto) return 'auto';
				if (alignLeft) return 'left';
				if (alignRight) return 'right';
				if (alignJustify) return 'justify';
				if (alignCenter) return 'center';
				return undefined;
			},
			get textAlignVertical() {
				if (vAlign) return vAlign;
				if (vAlignAuto) return 'auto';
				if (vAlignTop) return 'top';
				if (vAlignBottom) return 'bottom';
				if (vAlignCenter) return 'center';
				return undefined;
			},
			get flex() {
				switch (typeof flex) {
					case 'number':
						return flex;
					case 'boolean':
						return Boolean(flex) ? 1 : undefined;
					default:
						return undefined;
				}
			},
			get flexDirection() {
				if (direction) return direction;
				if (row) return reverse ? 'row-reverse' : 'row';
				return reverse ? 'column-reverse' : 'column';
			},
			get position() {
				if (absolute) return 'absolute';
				if (relative) return 'relative';
				return undefined;
			},
			get justifyContent() {
				if (justify) return justify;
				if (justifyEnd) return 'flex-end';
				if (justifyStart) return 'flex-start';
				if (justifyAround) return 'space-around';
				if (justifyEvenly) return 'space-evenly';
				if (justifyCenter) return 'center';
				if (justifyBetween) return 'space-between';
				return undefined;
			},
			get alignItems() {
				if (items) return items;
				if (itemsEnd) return 'flex-end';
				if (itemsStart) return 'flex-start';
				if (itemsBaseline) return 'baseline';
				if (itemsStretch) return 'stretch';
				if (itemsCenter) return 'center';
				return undefined;
			},
			get alignSelf() {
				if (self) return self;
				if (selfEnd) return 'flex-end';
				if (selfStart) return 'flex-start';
				if (selfAuto) return 'auto';
				if (selfStretch) return 'stretch';
				if (selfCenter) return 'center';
				return undefined;
			},
			get alignContent() {
				if (content) return content;
				if (contentEnd) return 'flex-end';
				if (contentStart) return 'flex-start';
				if (contentAround) return 'space-around';
				if (contentBetween) return 'space-between';
				if (contentStretch) return 'stretch';
				if (contentCenter) return 'center';
				return undefined;
			},
		},
	};
};
