const baseURL = 'http://localhost:3000'
const app = new Vue({
    el: '#app',
    data: {
        loginPage: true,
        registerPage: false,
        articles: [],
        allArticles: [],
        search: '',
        filterTag:'',
        selectedArticle: {
            title: 'hello',
            text: null,
        },
        updateArticle: {
            text: '',
            title: '',
            id: '',
            image: '',
            tags:[],
            newTag:''
        },
        showHide: {
            eachArticle: false,
            allArticles: false,
            addArticle: false,
            updateArticlePage: false,
            everyonesArticle: true,
        },
        islogin: false,
        password: '',
        email: '',
        name: '',
        newArticle: {
            text: '',
            title: '',
            image: '',
            tags:[],
            newTag:''
        },
        editArticle: {
            text: '',
            title: '',
            image: ''
        },
        file: ''
    },
    components: {
        wysiwyg: vueWysiwyg.default.component
    },
    methods: {
        
        fetchAfterLogin(){
            axios({
                method: 'GET',
                url: `${baseURL}/articles/myArticles`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .then((response) => {
                    this.articles = []
                    for (let i = 0; i < response.data.length; i++) {
                        let dateArray = response.data[i].created_at.slice(0, 10).split('-')
                        response.data[i].created_at = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
                        this.articles.push(response.data[i])
                    }
                    console.log(response)
                })
                .catch((err) => {
                    console.log(err)
                })
            axios({
                method: 'GET',
                url: `${baseURL}/articles`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .then((response) => {
                    this.allArticles = []
                    for (let i = 0; i < response.data.length; i++) {
                        let dateArray = response.data[i].created_at.slice(0, 10).split('-')
                        response.data[i].created_at = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
                        this.allArticles.push(response.data[i])
                    }
                    console.log(response)
                })
                .catch((err) => {
                    console.log(err)
                })
        
        },
        removeTags(state, tagValue){
            if(state === 'create'){
                this.newArticle.tags = this.newArticle.tags.filter((item)=>{
                    if(item !== tagValue){
                        return item
                    }
                })
            }else if(state === 'update'){
                this.updateArticle.tags = this.updateArticle.tags.filter((item)=>{
                    if(item !== tagValue){
                        return item
                    }
                })
            }
        },
        addTags(state){
            if(state === 'create'){
                if(!this.newArticle.tags.includes(this.newArticle.newTag)){
                    this.newArticle.tags.push(this.newArticle.newTag)
                }
            }else if(state === 'update'){
                if(!this.updateArticle.tags.includes(this.updateArticle.newTag)){
                    this.updateArticle.tags.push(this.updateArticle.newTag)
                }
            }
            this.newArticle.newTag=''
            this.updateArticle.newTag=''

        },
        deleteArticle: function (id) {
            console.log(this.articles)
            axios({
                method: 'DELETE',
                url: `${baseURL}/articles/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .then(({ data }) => {
                    let id = data._id
                    console.log(data._id)
                    this.articles = this.articles.filter(item => {
                        return (item._id !== id)
                    })
                    console.log(this.articles)
                    console.log(data)
                })
                .catch(({ error }) => {
                    console.log(error)
                })
        },
        tes: function () {
            console.log('testing button')
        },
        login: function () {
            console.log('hai')
            axios({
                method: 'POST',
                url: `${baseURL}/login`,
                data: {
                    email: this.email,
                    password: this.password
                }
            })
                .then(({ data }) => {
                    console.log(data)

                    let token = data.token
                    localStorage.setItem('token', token)
                    if (localStorage.getItem('token')) {
                        this.islogin = true
                    } else {
                        this.islogin = false
                    }
                })
                .catch(({ error }) => {
                    console.log(error)
                })
        },
        register: function () {
            console.log('hello register')
            axios({
                method: 'POST',
                url: `${baseURL}/register`,
                data: {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }
            })
                .then(({ data }) => {
                    console.log(data)
                    this.registerPage = false;
                    this.loginPage = true;
                })
                .catch(({ error }) => {
                    console.log(error)
                })
        },
        uploadImage: function () {
            this.file = ''
            this.file = event.target.files[0]
        },
        addNewArticle: function () {
            this.newArticle.image = this.file
            this.file = ''
            let formData = new FormData()
            formData.append('image', this.newArticle.image)
            formData.append('title', this.newArticle.title)
            formData.append('content', this.newArticle.text)
            for(let i = 0 ; i < this.newArticle.tags.length; i++){
                formData.append('tags', this.newArticle.tags[i])
            }
            axios({
                method: 'POST',
                url: `${baseURL}/articles`,
                // formData,
                data: formData,
                headers: {
                    token: localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'//; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
                // data:{
                //     title:this.newArticle.title,
                //     content:this.newArticle.text,
                //     image:formData
                // }
            })
                .then(({ data }) => {
                    this.articles.push(data)
                    this.allAritcles.push(data)
                    this.newArticle.text = ''
                    this.newArticle.title = ''
                    this.newArticle.image = ''
                    this.newArticle.tags= []
                    this.read(data._id)
                    console.log(data)
                })
                .catch(({ error }) => {
                    console.log(error)
                })
        },
        read: function (id) {
            let selectedArticle = this.articles.filter((item) => {
                console.log(item, "ini item")
                return (item._id === id)
            })
            this.toShowAndHide("eachArticle")
            this.selectedArticle = selectedArticle[0]
            console.log(this.selectedArticle, "this")
        },
        readAllArticle: function (id) {
            console.log(id)
            let selectedArticle = this.allArticles.filter((item) => {
                console.log(item, "ini item")
                return (item._id === id)
            })
            this.toShowAndHide("eachArticle")
            this.selectedArticle = selectedArticle[0]
            console.log(this.selectedArticle, "this")
        },
        signout: function () {
            localStorage.removeItem('token')
            if (localStorage.getItem('token')) {
                this.islogin = true
            } else {
                this.islogin = false
            }
        },
        updatePage: function (id) {
            //masih error kalau #updateArticlePage dengan v-if. kalau dengan v-show, updateArticle nya nggk ke render dalam page

            axios({
                method: 'GET',
                url: `${baseURL}/articles/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .then(({ data }) => {
                    console.log(data)
                    this.updateArticle.title = data.title
                    this.updateArticle.text = data.content
                    this.updateArticle.id = data._id
                    this.updateArticle.tags = data.tags
                    console.log(this.updateArticle.id)
                    this.toShowAndHide("updateArticlePage")
                })
                .catch((error) => {
                    console.log('masuk error')
                    console.log(error)
                })
        },
        update: function (id) {
            let formData = new FormData()
            this.updateArticle.image = this.file
            if(this.updateArticle.image){
                formData.append('image', this.updateArticle.image)
            }
            formData.append('title', this.updateArticle.title)
            formData.append('content', this.updateArticle.text)
            axios({
                method: 'PATCH',
                url: `${baseURL}/articles/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                },
                data: formData
            })
                .then(({ data }) => {
                    this.updateArticle.image = ''
                    this.updateArticle.title = ''
                    this.updateArticle.text = ''
                    this.articles = this.articles.map((item)=>{
                        if(item._id === data._id){
                            return data
                        }else{
                            return item
                        }
                    })
                    this.read(data._id)
                    console.log(data, 'update')
                })
                .catch(({ error }) => {
                    console.log(error)
                })
        },
        toShowAndHide: function (whichOne) {
            for (let i = 0; i < Object.keys(this.showHide).length; i++) {
                var currentKey = Object.keys(this.showHide)[i]
                if (currentKey === whichOne) {
                    this.showHide[currentKey] = true
                } else {
                    this.showHide[currentKey] = false
                }
            }
        },
        tagFromArticle(tag){
            this.filterByTag(tag)
            this.toShowAndHide('everyonesArticle')
        },
        filterByTag(tag){
            if(tag){
                this.filterTag = tag
            }else{
                this.filterTag =''
            }
        }
    },
    computed: {
        allTags(){
            let allTags = {}
            if(this.filteredAllArticle){
                for( let i = 0; i < this.filteredAllArticle.length; i++){
                    console.log('hai dari alltags')
                    for( let j = 0; j < this.filteredAllArticle[i].tags.length; j++){
                        console.log(this.filteredAllArticle[i].tags[j])
                        allTags[this.filteredAllArticle[i].tags[j]] = true
                    }
                }
            }else{
                for( let i = 0; i < this.allArticles.length; i++){
                    console.log('hai dari alltags')
                    for( let j = 0; j < this.allArticles[i].tags.length; j++){
                        console.log(this.allArticles[i].tags[j])
                        allTags[this.allArticles[i].tags[j]] = true
                    }
                }

            }
            let result = Object.keys(allTags)
            console.log(allTags)
            return result
        },
        dateFormating(date) {
            let dateArray = date.
                return(`${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`)
        },
        filtered() {
            if (this.search) {
                let result = []
                result = this.articles.filter((item) => {
                    return item.title.toLowerCase().includes(this.search.toLowerCase())
                })
                if (result.length === 0) {
                    return this.articles
                } else {
                    return result
                }
            } else {
                return this.articles
            }
        },
        filteredAllArticle() {
            if(this.search && this.filterTag){
                let result = []
                result = this.allArticles.filter((item) => {
                    return item.title.toLowerCase().includes(this.search.toLowerCase())
                })
                result = result.filter((item)=>{
                    return item.tags.includes(this.filterTag)
                })
                if (result.length === 0) {
                    return this.allArticles
                } else {
                    return result
                }
            }else if (this.search) {
                let result = []
                result = this.allArticles.filter((item) => {
                    return item.title.toLowerCase().includes(this.search.toLowerCase())
                })
                if (result.length === 0) {
                    return this.allArticles
                } else {
                    return result
                }
            } else if(this.filterTag){
                let result = []
                result = this.allArticles.filter((item)=>{
                    return item.tags.includes(this.filterTag)
                })
                return result
            }else {
                return this.allArticles
            }
        }
        
    },
    watch: {
        islogin(){
            if(this.islogin){
                
                this.fetchAfterLogin()
            }
        }

    },
    created() {
        if (localStorage.getItem('token')) {
            this.islogin = true
        } else {
            this.islogin = false
        }

        if (this.islogin) {
            this.fetchAfterLogin()
            // console.log(this.allTags(), 'alltags')
        } 
    }
})