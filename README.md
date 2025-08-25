# Pharma Management App
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```
### Compiles and minifies for production
```
生产环境：
npm run build
```
### 功能简介
> 这是一个药品处方履行前端系统，主要包括4个功能页面以及一个数据重置页面.
>
> 使用vite初始化工程，vue3 + ts为基础框架和模板，ui框架使用element-plus,mock功能使用msw
> 
> 
> 默认数据在启动后会设置在localStorage中，可以在设置页面删除mock数据或者重置mock数据以便测试
>
> 在履行药放页面我创建了几个药房分别包含成功、过期、超出限制等情况的case


### 已完成内容
> 基础功能
### 未完成内容
> 1、单元测试
>
> 2、typescript 补全

### 遗留问题
> 1、没有开处方的页面
> 
> 2、未配药处方管理没有删除或者取消的功能
> 
> 3、患者id和患者名字 不知道这个代表的是什么，导致日志页面不知道患者框那里输入的是患者id还是患者名称
> 
> 4、管理处方和履行界面，履行处方成功或者失败的判断没有给出，如果药方里的部分药品满足条件部分不满足条件该算失败还是成功。目前我写的代码的版本算失败。这样在日志界面对应的日志里，已分配药品表格就为空。
> 
> 5、药方履行成功之后，该药店下的药品额度是否要对应减掉没有说明