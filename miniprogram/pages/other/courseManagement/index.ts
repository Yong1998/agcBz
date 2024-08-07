import { login, getGlobalAttr, saveGlobalAttr } from '../../../apis/index'
import {deepClone, debounce} from '../../../utils/util'

const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'tur', 'fri', 'sat'];
let CLASS_TYPE = ["精品课", "入门课", "入门课"]
let CLASS_TIME = ["13:30-14:30", "14:40-15:40", "15:50-16:50", "17:00-18:00", "17:00-18:00", "18:10-19:10", "19:20-20:20", "20:30-21:20"]
let DANCE_TYPE = ["HIPHOP/CHOREO", "JAZZ FUNK", "JAZZ", "HELLS", "JAZZ/KPOP", "JAZZ/国风", "HIPHOP", "JAZZ/CHOREO", "JAZZ/KPOP"]
let TEACHERS = ["糖果", "强子", "琳琳", "嘉茹", "大灰", "啊培", "LYDIA", "泰迪", "MK", "团子", "嫣然", "CC", "美延", "雯雯", "YIYI", "微微", "紫妍", "小小"]

let attrValue = null as any

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 渲染课程列表
    days: DAYS, // 周几
    day: '周一', // 
    dayKey: 'mon', // 'mon', 'tue', 'wed', 'tur', 'fri', 'sat', 'sun
    dayKeys: DAY_KEYS,
    dayIndex: 0, // 默认周一
    editForm: {
      classTime: {
        value: '',
        list: [],
        selected: '',
      },
      danceType: {
        value: '',
        list: [],
        selected: '',

      },
      teacher: {
        value: '',
        list: [],
        selected: '',
      },
      newTeacher: {
        value: '',
        list: [],
        selected: '',
      },
      classType: {
        value: '',
        list: [],
        selected: '',
      },
    },
    isEditShow: false,
    isEditIndex: '',
    editType: '',

    config: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    login().then(() => {
      getGlobalAttr('test-mangement').then(res => {
        const { list, config, modify } = res
        // 获取第二天的时间
        const today = new Date()
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

        const dayKey = DAY_KEYS[tomorrow.getDay()]
        const day = DAYS[tomorrow.getDay()]
        const dayIndex = tomorrow.getDay()
        let curList = null
        if(modify && Object.keys(modify).length) {
          curList = modify[dayKey]
        } else {
          curList = list[dayKey]
        }
        this.setData({
          list: curList,
          dayKey,
          day,
          dayIndex,
          config,
        })
        CLASS_TYPE = config.classType
        CLASS_TIME = config.classTime
        DANCE_TYPE = config.danceType
        TEACHERS = config.teachers
        attrValue = res
      })
    })
  },

  onPickerChange(e:any) {
    const { value:index } = e.detail
    const day = DAYS[index]
    const dayKey = DAY_KEYS[index]
    let curList = null
    if(attrValue.modify && Object.keys(attrValue.modify).length) {
      curList = attrValue.modify[dayKey]
    } else {
      curList = attrValue.list[dayKey]
    }
    this.setData({
      list: curList,
      day,
      dayKey,
      dayIndex: index
    })
  },

  edit(e: any) {
    const { index, type: editType } = e.currentTarget.dataset
    const item = this.data.list[index] as any
    const oldItem = attrValue.list[this.data.dayKey][index]
    const newTeacherValue = item.teacher.split('/')[1]?.split('(')[0]?.replace(' ', '') || ''
    this.setData({
      [`editForm.classTime.value`]: item.classTime,
      [`editForm.danceType.value`]: item.danceType,
      [`editForm.teacher.value`]: oldItem.teacher,
      [`editForm.newTeacher.value`]: newTeacherValue,
      [`editForm.classType.value`]: item.classType,
      isEditShow: true,
      isEditIndex: index,
      editType
    })
  },

  onPopupMaskClick() {
    this.setData({
      isEditShow: false
    })
  },

  onInputFocus(e:any) {
    const { key } = e.currentTarget.dataset
    const {editForm} = this.data as any
    // const value = e.detail.value
    let list = [] as any
    if(key === 'classTime') list = CLASS_TIME
    if(key === 'teacher') list = TEACHERS
    if(key === 'newTeacher') list = TEACHERS.filter((item: any) => item !== editForm.teacher.value)
    if(key === 'danceType') list = DANCE_TYPE
    if(key === 'classType') list = CLASS_TYPE
    Object.keys(editForm).forEach(key => {
      this.setData({
        [`editForm.${key}.list`]: [],
      })
    })
    
    const value = editForm[key].value || ''
    let selected = editForm[key].selected || Math.floor(list.length / 2) - 1
    if(value) {
      const index = list.findIndex((item: any) => item.includes(value))
      index > -1 && (selected = index)
    }
    this.setData({
      [`editForm.${key}.list`]: list,
      [`editForm.${key}.selected`]: selected,  // 默认选择中间值
    })
  },

  onInputBlur(e:any) {
    const { key } = e.currentTarget.dataset
    const value = e.detail.value
    if(!value) return
    this.setData({
      // [`editForm.${key}.list`]: [],
    })
  },

  onInputChange(e: any) {
    const { key } = e.currentTarget.dataset
    const value = e.detail.value
    if(!value) return
    this.setData({
      [`editForm.${key}.value`]: value,
    })
  },
  onInput(e:any) {
    debounce(() => {
      const { key } = e.currentTarget.dataset
      const value = e.detail.value
      // 正则匹配对应的值 不区分大小写
      let list = [] as any
      if(key === 'classTime') list = CLASS_TIME
      if(key === 'teacher') list = TEACHERS
      if(key === 'newTeacher') list = TEACHERS.filter((item: any) => item !== this.data.editForm.teacher.value)
      if(key === 'danceType') list = DANCE_TYPE
      if(key === 'classType') list = CLASS_TYPE
      if(!value) {
        this.setData({
          [`editForm.${key}.list`]: list,
          [`editForm.${key}.value`]: '',
        })
      } else {
        const reg = new RegExp(value, 'i')
        list = list.filter((item: any) => reg.test(item))
        this.setData({
          [`editForm.${key}.list`]: list,
        })
      }
    }, 500)
  },
  onSelectClick(e:any) {
    const { key, value, index } = e.currentTarget.dataset
    console.log(`value ===>`, value)
    this.setData({
      [`editForm.${key}.list`]: [],
    })
    setTimeout(() => {
      this.setData({
        [`editForm.${key}.value`]: value,
        [`editForm.${key}.selected`]: index,
        [`editForm.${key}.list`]: [],
      },() => {
        console.log(`this.data.editForm  ===>`, this.data.editForm)
      })
    }, 100);
   
  },

  onCancelClick() {
    this.setData({
      isEditShow: false,
      [`editForm.classTime.list`]: [],
      [`editForm.danceType.list`]: [],
      [`editForm.teacher.list`]: [],
      [`editForm.newTeacher.list`]: [],
      [`editForm.classType.list`]: [],
    })
  },

  onConfirmClick() {
    const {editForm, list, isEditIndex, editType, dayKey} = this.data as any
    // const { list: classList  } = attrValue
    const newItem = {} as any
    // const oldItem = classList[dayKey][isEditIndex]
    
    for(let key in editForm) {
      newItem[key] = editForm[key].value
    }

    if(editType === 'edit') {
      let teacher = newItem.teacher
      newItem.newTeacher && (teacher+=` / ${newItem.newTeacher}(代课)`)
      newItem.isEdited = newItem.newTeacher
      newItem.teacher = teacher
      delete newItem.newTeacher
    }

    const newList = deepClone(list)
    newList[isEditIndex] = newItem

    // const newModify = deepClone(attrValue.list)
    let newModify = {} as any
    if(attrValue.modify && Object.keys(attrValue.modify).length) {
      newModify = deepClone(attrValue.modify)
    } else {
      newModify = deepClone(attrValue.list)
    }
    newModify[this.data.dayKey] = newList
    attrValue.modify = newModify
    saveGlobalAttr({ attrValue: JSON.stringify(attrValue) }).then(() => {
      this.setData({
        list: newList,
        isEditShow: false,
        [`editForm.classTime.list`]: [],
        [`editForm.danceType.list`]: [],
        [`editForm.teacher.list`]: [],
        [`editForm.newTeacher.list`]: [],
        [`editForm.classType.list`]: [],
      })
    })
  },
  onFormCatch() {
    this.setData({
      [`editForm.classTime.list`]: [],
      [`editForm.danceType.list`]: [],
      [`editForm.teacher.list`]: [],
      [`editForm.newTeacher.list`]: [],
      [`editForm.classType.list`]: [],
    })
  },

  cancelClass(e:any) {
    const { index, type } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: `确定${type}吗？`,
      success: (res) => {
        if (res.confirm) {
          const { list } = this.data as any
          const item = list[index] as any
          const newItem = {
            ...item,
            classTime: item.classTime,
            danceType: item.danceType,
            teacher: item.teacher,
            classType: item.classType,
            noClass: type === '请假' ? true : false,
          }
          if(newItem.isEdited) {
            newItem.teacher = newItem.teacher.split('/')[0]
            newItem.isEdited = false
          }

          type === '请假' && (newItem.teacher+='(请假)')
          type === '取消请假' && (newItem.teacher = newItem.teacher.replace('(请假)', ''))
          
          const newList = deepClone(list)
          newList[index] = newItem
      
          let newModify = {} as any
          if(attrValue.modify && Object.keys(attrValue.modify).length) {
            newModify = deepClone(attrValue.modify)
          } else {
            newModify = deepClone(attrValue.list)
          }
          newModify[this.data.dayKey] = newList
          attrValue.modify = newModify
          saveGlobalAttr({ attrValue: JSON.stringify(attrValue) }).then(() => {
            this.setData({
              list: newList,
            })
          })
        }
      }
    })
  },


  onTabsChange() {
    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onTabsClick(event:any) {
    const { value:index } = event.detail
    const day = DAYS[index]
    const dayKey = DAY_KEYS[index]
    let curList = null
    if(attrValue.modify && Object.keys(attrValue.modify).length) {
      curList = attrValue.modify[dayKey]
    } else {
      curList = attrValue.list[dayKey]
    }
    this.setData({
      list: curList,
      day,
      dayKey,
      dayIndex: index
    })
  },

  onVisibleChange(e:any) {
    this.setData({
      isEditShow: e.detail.visible,
    });
  },
})