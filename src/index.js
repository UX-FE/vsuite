// es6 polyfill 加载Polyfill类库，就能使用IE10等或者还没有提供对Promise支持的浏览器中使用Promise里规定的方法。
import 'core-js/fn/array/find'
import 'core-js/fn/array/find-index'

// import component
// import base component
import Row from './components/row'
import Col from './components/col'
import Layout from './components/layout'
import Header from './components/header'
import Sider from './components/sider'
import Main from './components/main'
import Footer from './components/footer'
import Icon from './components/icon'
import BaseButton from './components/button'
import ButtonGroup from './components/buttongroup'
// import form component
import FormInput from './components/input'
import FormSelect from './components/select'
import FormSwitch from './components/switch'
import Date from './components/date'
import Rate from './components/rate'
import Upload from './components/upload'
import FormOption from './components/option'
import OptionGroup from './components/optiongroup'
import Radio from './components/radio'
import RadioGroup from './components/radiogroup'
import Checkbox from './components/checkbox'
import CheckboxGroup from './components/checkboxgroup'
import Form from './components/form'
import FormItem from './components/formitem'
// import dialog component
import Modal from './components/modal'
import Drawer from './components/drawer'
// import tip component
import Alert from './components/alert'
import Loading from './components/loading'
import NoData from './components/nodata'
import Tooltip from './components/tooltip'
import Bubble from './components/bubble'
// import data component
import Table from './components/table'
import Page from './components/page'
import Tree from './components/tree'
import TreeNode from './components/treenode'
import Progress from './components/progress'
import Tag from './components/tag'
import TagGroup from './components/taggroup'
import Badge from './components/badge'
// import navigation component
import Step from './components/step'
import StepItem from './components/stepitem'
import Bread from './components/bread'
import BreadItem from './components/breaditem'
import Tab from './components/tab'
import TabContent from './components/tabcontent'
import Menu from './components/menu'
import MenuGroup from './components/menugroup'
import MenuItem from './components/menuitem'
import SubMenu from './components/submenu'
import DropDown from './components/dropdown'
import DropDownList from './components/dropdownlist'
import DropDownItem from './components/dropdownitem'
// import view component
import Avatar from './components/avatar'
import Card from './components/card'
import CardGroup from './components/cardgroup'
import Transfer from './components/transfer'
import TimeLine from './components/timeline'
import Scroll from './components/scroll'
import TimeLineItem from './components/timelineitem'
import Carousel from './components/carousel'
import CarouselItem from './components/carouselitem'
import Collapse from './components/collapse'
import CollapseItem from './components/collapseitem'
import BackTop from './components/backtop'

import locale from './locale/index'

// Defining components
const components = {
  Row,
  Col,
  Layout,
  Header,
  Sider,
  Main,
  Footer,
  Icon,
  FormSelect,
  FormSwitch,
  FormOption,
  OptionGroup,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Table,
  Page,
  Tree,
  TreeNode,
  Progress,
  Tooltip,
  Bubble,
  Tag,
  TagGroup,
  Badge,
  Date,
  Avatar,
  BaseButton,
  ButtonGroup,
  Transfer,
  TimeLine,
  TimeLineItem,
  Scroll,
  Carousel,
  CarouselItem,
  BackTop,
  Tab,
  TabContent,
  Step,
  StepItem,
  Bread,
  BreadItem,
  Rate,
  Upload,
  Collapse,
  CollapseItem,
  FormInput,
  Card,
  CardGroup,
  Menu,
  MenuItem,
  MenuGroup,
  SubMenu,
  DropDown,
  DropDownList,
  DropDownItem,
  Modal,
  Drawer,
  Alert,
  Loading,
  NoData
}

const vsuite = {
  ...components
}
// Define the installation function
const install = function (Vue, opts = {}) {
    // Judge whether or not it has been install
  if (install.installed) return
  locale.use(opts.locale)
  locale.i18n(opts.i18n)

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
  })
  Vue.prototype.$Modal = Modal
  Vue.prototype.$Loading = Loading
}

// auto install while vue exist
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
// Define API
const API = {
  version: process.env.VERSION, // eslint-disable-line no-undef
  locale: locale.use,
  i18n: locale.i18n,
  install,
  ...components
}
// Define API.lang
API.lang = (code) => {
  const langObject = window['vsuite/locale'].default
  if (code === langObject.i.locale) locale.use(langObject)
  else console.log(`The ${code} language pack is not loaded.`) // eslint-disable-line no-console
}
// exports API
export default API
// eslint-disable-line no-undef
