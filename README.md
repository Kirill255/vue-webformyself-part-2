# vue-webformyself-part-2

# ad-app

[part 1](https://github.com/Kirill255/vue-webformyself-part-1)

`vue init vuetifyjs/webpack my-project`

> A Vue.js project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Tips

1. Use stylus with https://github.com/vuetifyjs/webpack, с этим шаблоном нам достаточно установить лоадер и стилус и подключить файлы stylus, настраивать webpack конфиг не нужно. `npm install stylus-loader stylus --save-dev` and include in main.js your style.styl file or use lang="stylus" in vue components

### Known issues

1. Есть проблема с изменением стора без мутации при markOrderDone. (Но в продакшене ошибки нету, так как `strict: process.env.NODE_ENV !== "production"`)

2. (Исправлено!) ~~Ещё почему-то при повторных кликах на checkbox в заказах, checkbox изменяет своё состояние(checked/unchecked), хотя значение там должно быть всегда true, в базе конечно же это значение не изменяется (там всё правильно, значение true), но визуально сам checkbox изменяется, возможно это что-то в самом vuetify, быстро погуглив я ничего не нашёл, возможно там нужно использовать событие click с prevent вместо change.~~

3. Есть проблема с защитой роута, при перезагрузке страницы, у нас сначала проверяется есть ли доступ к странице (к роуту), и в этот момент у нас ещё не подтянулись данные из базы, поэтому сначала перекидывает на страницу логина (с ошибкой), а после уже наконец-то приходят данные из базы, и состояние авторизованного пользователя восстанавливается (пользователь залогинен).

### Related

https://github.com/mmasterenko/vue-demo

https://github.com/php-user1/vue-project

https://github.com/awentis/vue-ads

https://github.com/pefimchenkov/web-portal

https://github.com/EugeneKorniets/training-vue-project

https://github.com/academind/yt-devmeetup-vue-firebase (https://www.youtube.com/playlist?list=PL55RiY5tL51qxUbODJG9cgrsVd7ZHbPrt)

https://medium.com/@anas.mammeri/vue-2-firebase-how-to-add-firebase-social-sign-in-into-your-vue-application-21f341bbf1b

https://blog.expo.io/firebase-github-authentication-with-react-native-2543e32697b4
