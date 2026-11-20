import type { RouterConfig } from '@nuxt/schema'

// Le scroll est géré par Lenis (transitions de page + ancres).
export default <RouterConfig>{
  scrollBehavior: () => false,
}
