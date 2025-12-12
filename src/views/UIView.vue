<template>
  <div class="ui-view">
    <h1>UIView — Component Preview</h1>
    <p>Automatically loads components from <code>src/components/shared/basic</code> and <code>src/components/shared/form</code>.</p>

    <div class="grid">
      <div v-for="c in comps" :key="c.id" class="card">
        <div class="card-title">{{ c.name }}</div>
        <div class="card-body">
          <component :is="c.comp" v-bind="exampleProps[c.name] || {}" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Glob import all components under shared/basic and shared/form
const modules = import.meta.globEager('/src/components/shared/{basic,form}/*.vue')

const comps = Object.keys(modules).map((p, i) => {
  const mod = modules[p]
  const comp = mod.default || mod
  const name = comp.name || p.split('/').pop().replace('.vue','')
  return { id: i, name, comp }
})

// Example props for some known components
const exampleProps = {
  Button: { variant: 'primary' },
  PrimaryButton: { variant: 'primary' },
  TextInput: { modelValue: '', label: 'Label', placeholder: '값' },
  Input: { modelValue: '', label: 'Label' },
  SearchInput: { modelValue: '' },
  Toggle: { modelValue: false },
  Checkbox: { modelValue: false },
  Tag: { removable: true },
  Dropdown: { options: [{ label: '옵션1', value: 1 }] },
  Pagination: { current: 1, total: 10 },
}
</script>

<style scoped>
.ui-view{ padding:20px }
.grid{ display:grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap:18px }
.card{ background: #fff; border-radius:12px; padding:12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06) }
.card-title{ font-weight:700; margin-bottom:8px }
.card-body{ min-height:80px; display:flex; align-items:center; justify-content:center }
</style>
