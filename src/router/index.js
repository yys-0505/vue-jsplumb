import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Opt11 from 'components/Opt11'
import Opt12 from 'components/Opt12'
import Opt13 from 'components/Opt13'
import Opt14 from 'components/Opt14'
import Opt15 from 'components/Opt15'
import Opt16 from 'components/Opt16'
import Opt17 from 'components/Opt17'
import Opt18 from 'components/Opt18'
import Opt19 from 'components/Opt19'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            component: Home,
            redirect: '/opt11',
            children: [
                {path: '/opt11', component: Opt11},
                {path: '/opt12', component: Opt12},
                {path: '/opt13', component: Opt13},
                {path: '/opt14', component: Opt14},
                {path: '/opt15', component: Opt15},
                {path: '/opt16', component: Opt16},
                {path: '/opt17', component: Opt17},
                {path: '/opt18', component: Opt18},
                {path: '/opt19', component: Opt19}
            ]
        },
        {path: '*', redirect: '/'}
    ]
});

export default router;