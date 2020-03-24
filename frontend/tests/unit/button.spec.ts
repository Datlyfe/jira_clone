import { render, fireEvent } from '@testing-library/vue'
import Button from '@/components/shared/Button/Button.vue'
import Icon from '@/components/shared/Icon/Icon.vue'

describe('button', () => {
  it('renders default structure', async () => {
    const { container } = render(Button, {
      slots: {
        default: 'Hello'
      }
    })

    const el = container.firstElementChild!
    expect(el.tagName.toLowerCase() === 'button').toBe(true)
    expect(el.getAttribute('type')).toBeDefined()
    expect(el.getAttribute('type')).toBe('button')
    expect(el.classList).toContain('button')
    expect(el.classList).toContain('primary')
    expect(el.classList.length).toBe(2)
  })

  it('renders default slot content', async () => {
    const { container, getByText } = render(Button, {
      slots: {
        default: '<span>foobar</span>'
      }
    })

    const el = container.firstElementChild!
    expect(el.tagName.toLowerCase() === 'button').toBe(true)
    expect(el.getAttribute('type')).toBeDefined()
    expect(el.getAttribute('type')).toBe('button')
    expect(el.classList).toContain('button')
    expect(el.classList).toContain('primary')
    expect(el.classList.length).toBe(2)

    expect(getByText('foobar').textContent).toBe('foobar')
  })

  it('applies variant class', async () => {
    const { getByRole, updateProps } = render(Button, {
      slots: {
        default: 'Hello'
      },
      props: {
        variant: 'danger'
      }
    })

    const el = getByRole('button')
    expect(el.tagName.toLowerCase() === 'button').toBe(true)
    expect(el.getAttribute('type')).toBeDefined()
    expect(el.getAttribute('type')).toBe('button')
    expect(el.classList).toContain('button')
    expect(el.classList).toContain('danger')
    expect(el.classList.length).toBe(2)

    await updateProps({
      variant: 'warning'
    })

    expect(el.classList).toContain('button')
    expect(el.classList).toContain('warning')
    expect(el.classList.length).toBe(2)
  })

  it('apply iconOnly class when no default slots is set', async () => {
    const { container } = render(Button)

    const el = container.firstElementChild!
    expect(el.tagName.toLowerCase() === 'button').toBe(true)
    expect(el.getAttribute('type')).toBeDefined()
    expect(el.getAttribute('type')).toBe('button')
    expect(el.classList).toContain('button')
    expect(el.classList).toContain('iconOnly')
    expect(el.classList.length).toBe(3)
  })

  it('renders button with icon', async () => {
    const { getByText, getByRole, container } = render(Button, {
      slots: {
        default: 'hello'
      },
      props: {
        icon: 'plus'
      },
      stubs: {
        'j-icon': Icon
      }
    })

    const el = getByRole('button')
    expect(el.tagName.toLowerCase() === 'button').toBe(true)
    expect(el.getAttribute('type')).toBeDefined()
    expect(el.getAttribute('type')).toBe('button')
    expect(el.classList).toContain('button')
    expect(el.classList.length).toBe(2)

    const svgIcon = container.querySelector('svg')
    expect(svgIcon).toBeDefined()

    const textWrapper = getByText('hello')
    expect(textWrapper.classList).toContain('withPadding')
  })

  it('should emit click event when clicked', async () => {
    let called = 0
    let evt = null
    const { getByRole } = render(Button, {
      slots: {
        default: 'hello'
      },
      listeners: {
        click: (e: MouseEvent) => {
          evt = e
          called++
        }
      }
    })

    const el = getByRole('button')
    expect(el.tagName.toLowerCase() === 'button').toBe(true)
    expect(el.getAttribute('type')).toBeDefined()
    expect(el.getAttribute('type')).toBe('button')

    expect(called).toBe(0)
    expect(evt).toEqual(null)

    await fireEvent.click(el)

    expect(called).toBe(1)
    expect(evt).toBeInstanceOf(MouseEvent)
  })
})
