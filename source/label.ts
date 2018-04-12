
import { ChangeLookup } from './changelookup';
import { Color } from './color';
import { FontFace } from './fontface';
import { Text } from './text';


/**
 * Object comprising a text reference, a font face, and additional typographic information for type setting, rendering,
 * and interaction. Multiple labels might reference the same text, but could be placed at different locations or
 * rendered applying different font faces, styles etc.
 */
export class Label {

    /** @see {@link text} */
    protected _text: Text | string;

    /** @see {@link wordWrap} */
    protected _wordWrap = false;

    /** @see {@link alignment} */
    protected _alignment: Label.Alignment = Label.Alignment.Left;

    /** @see {@link lineAnchor} */
    protected _lineAnchor: Label.LineAnchor = Label.LineAnchor.Baseline;

    /** @see {@link lineWidth} */
    protected _lineWidth = 0.0;


    /** @see {@link fontFace} */
    protected _fontFace: FontFace;

    /** @see {@link color} */
    protected _color: Color;

    /** @see {@link background} */
    protected _backgroundColor: Color;


    /** @see {@link altered} */
    protected readonly _altered = Object.assign(new ChangeLookup(), {
        any: false, color: false, resources: false, text: false, typesetting: false, transformation: false,
    });

    /**
     * Returns the character at the specified index.
     * @param pos - The zero-based index of the desired character.
     */
    charAt(index: number): string {
        if (this._text instanceof Text) {
            return this._text.text.charAt(index);
        }
        return this._text.charAt(index);
    }

    /**
     * Returns the Unicode value of the character at the specified location.
     * @param index - The zero-based index of the desired character. If there is no character at the specified index,
     * NaN is returned.
     */
    charCodeAt(index: number): number {
        if (this._text instanceof Text) {
            return this._text.text.charCodeAt(index);
        }
        return this._text.charCodeAt(index);
    }

    /**
     * Returns, whether or not the character at a given index is equal to the default or the text's line feed character.
     * @param index - The zero-based index of the desired character. If there is no character at the specified index,
     * NaN is returned.
     */
    lineFeedAt(index: number): boolean {
        return this.charAt(index) === this.lineFeed;
    }


    kerningBefore(index: number): number {
        if (index < 1 || index > this.length) {
            return NaN;
        }
        return this._fontFace.kerning(this.charCodeAt(index - 1), this.charCodeAt(index));
    }

    kerningAfter(index: number): number {
        if (index < 0 || index > this.length - 1) {
            return NaN;
        }
        return this._fontFace.kerning(this.charCodeAt(index), this.charCodeAt(index + 1));
    }

    /**
     * Returns the advancement of a specified glyph.
     * @param index - The zero-based index of the desired character. If there is no character at the specified index,
     * NaN is returned.
     */
    advance(index: number): number {
        if (index < 0 || index > this.length) {
            return NaN;
        }
        return this._fontFace.glyph(this.charCodeAt(index)).advance;
    }


    /**
     * Text that is to be rendered.
     */
    set text(text: Text | string) {
        this._altered.alter('text');
        this._text = text;
    }
    get text(): Text | string {
        return this._text;
    }

    /**
     * Length of the text, i.e., number of characters within the text.
     */
    get length(): number {
        return this._text.length;
    }

    /**
     * Character that is to be used for Line feed.
     */
    get lineFeed(): string {
        if (this._text instanceof Text) {
            return this._text.lineFeed;
        }
        return Text.DEFAULT_LINEFEED;
    }

    /**
     * Whether or not words can be wrapped at the end of a line.
     * @param wrap - `true` if word wrap is enabled, else `false`
     */
    set wordWrap(wrap: boolean) {
        if (this._wordWrap === wrap) {
            return;
        }
        this._altered.alter('typesetting');
        this._wordWrap = wrap;
    }
    get wordWrap(): boolean {
        return this._wordWrap;
    }

    /**
     * Horizontal text alignment for typesetting.
     */
    set alignment(alignment: Label.Alignment) {
        if (this._alignment === alignment) {
            return;
        }
        this._altered.alter('typesetting');
        this._alignment = alignment;
    }
    get alignment(): Label.Alignment {
        return this._alignment;
    }

    /**
     * Vertical text anchor point used for positional reference.
     */
    set lineAnchor(anchor: Label.LineAnchor) {
        if (this._lineAnchor === anchor) {
            return;
        }
        this._altered.alter('typesetting');
        this._lineAnchor = anchor;
    }
    get lineAnchor(): Label.LineAnchor {
        return this._lineAnchor;
    }

    /**
     * Width of a single line (in pt or w.r.t. font face scaling in world space respectively). The width of the line
     * is not intended to be set explicitly, but implicitly vie transformations/label placement.
     */
    get lineWidth(): number {
        return this._lineWidth;
    }

    /**
     * Font face used for typesetting, transformation, and rendering.
     */
    set fontFace(fontFace: FontFace) {
        if (this._fontFace === fontFace) {
            return;
        }
        this._altered.alter('typesetting');
        this._altered.alter('resources');
        this._fontFace = fontFace;
    }
    get fontFace(): FontFace {
        return this._fontFace;
    }

    /**
     * Color used for text rendering.
     */
    set color(color: Color) {
        if (this._color.equals(color)) {
            return;
        }
        this._altered.alter('color');
        this._color = color;
    }
    get color(): Color {
        return this._color;
    }

    /**
     * Color used for background of text rendering.
     */
    set backgroundColor(color: Color) {
        if (this._backgroundColor.equals(color)) {
            return;
        }
        this._altered.alter('color');
        this._backgroundColor = color;
    }
    get backgroundColor(): Color {
        return this._backgroundColor;
    }

    toString(): string {
        if (this._text instanceof Text) {
            return this._text.text;
        }
        return this._text;
    }

    /*
    * Whether or not any property or the referenced text has changed requiring, e.g., the new typesetting.
    * The alteration status can be reset using `reset` (@see {@link reset}).
    */
    get altered(): boolean {
        return this._altered.any || (this._text instanceof Text ? this._text.altered : false);
    }

    /**
     * Intended for resetting alteration status.
     */
    reset() {
        this._altered.reset();
    }

}

export namespace Label {

    export enum Alignment {
        Left = 'left',
        Center = 'center',
        Right = 'right',
    }

    export enum LineAnchor {
        Top = 'top',
        Ascent = 'ascent',
        Center = 'center',
        Baseline = 'baseline',
        Descent = 'descent',
        Bottom = 'bottom',
    }

}
