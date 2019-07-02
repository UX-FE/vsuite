import Vue from 'vue'
import { createVue, createTest, destroyVM } from '../util'
import Alert from '../../../src/components/alert'

describe('alert.vue', () => {
  let vm
  afterEach(() => {
    destroyVM(vm)
  })
  // it('create', done => {
  //   vm = createVue(`
  //     <Alert type="info">这是一些提示信息</Alert>
  //   `)
  //   console.log(vm)
  //   // expect(vm.$el.classList.indexOf('vsu-alert')).to.equal(0)

  //   vm.$nextTick(_ => {
  //     // console.log(vm.$el.querySelector('.ivu-breadcrumb-item-separator').innerHTML);
  //     expect(vm.$el.innerText).to.equal(' 这是一些提示信息 ')
  //     done()
  //   })
  // })
  it('close', done => {
    vm = createTest(Alert, {
      mode: 'normal',
      autoHidden: true,
      duration: 1.5,
      value: true,
      type: 'info',
      closable: false,
      showIcon: false,
      closeIcon: 'ios-close-empty',
      top: 60
    })
    vm.close()
    done()
  })
})
