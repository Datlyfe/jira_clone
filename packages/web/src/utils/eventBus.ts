import Mitt from 'mitt'

type Events = { [key: string]: any }

export default Mitt<Events>()
