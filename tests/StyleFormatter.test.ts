import { TextStyle, Color } from '../src/Output/Style'
import { TestColor } from './__mocks__'

function format() {
	return new TextStyle(new TestColor())
}

describe('StyleFormatter', () => {
	test('Built in formats', () => {
		expect(format().info('foo')).toBe('[yellow|]foo')
		expect(format().error('foo')).toBe('[white|red]foo')
		expect(format().comment('foo')).toBe('[default|default]foo')
		expect(format().warning('foo')).toBe('[black|yellow]foo')
		expect(format().note('foo')).toBe('[yellow|]foo')
		expect(format().caution('foo')).toBe('[white|red]foo')
		expect(format().question('foo')).toBe('[white|]foo')
		expect(format().success('foo')).toBe('[green|]foo')
	})

	test('Custom formats', () => {
		expect(format().format('foo', { text: 'yellow' })).toBe('[yellow|]foo')
		expect(format().format('foo', { bg: 'yellow' })).toBe('[|yellow]foo')
		expect(format().format('foo', { text: 'yellow', bg: 'green' })).toBe('[yellow|green]foo')
	})

	test('Exposes the color generator', () => {
		expect(new TextStyle().getColor()).toBeInstanceOf(Color)
	})

	test('Color Mapper', () => {
		const c = new (class extends Color {
			protected foregroundColors: any = {
				black: {
					set: '#1',
					unset: '#2',
				},
			}

			protected backgroundColors: any = {
				black: {
					set: '$1',
					unset: '$2',
				},
			}
		})()

		expect(c.apply('foo', { text: 'black' })).toBe('#1foo#2')
		expect(c.apply('foo', { bg: 'black' })).toBe('$1foo$2')
		expect(c.apply('foo', { text: 'black', bg: 'black' })).toBe('#1$1foo#2$2')
	})
})
