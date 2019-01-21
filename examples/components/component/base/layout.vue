<template>
    <div class="other">
            <div class="wrap base-demo">
                <Layout>
                    <Header>Header</Header>
                    <Main>Main</Main>
                    <Footer>Footer</Footer>
                </Layout>
                <br/>
                <Layout>
                    <Header>Header</Header>
                    <Layout>
                        <Sider hide-trigger>Sider</Sider>
                        <Main>Main</Main>
                    </Layout>
                    <Footer>Footer</Footer>
                </Layout>
                <br/>
                <Layout>
                    <Sider hide-trigger>Sider</Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Main>Main</Main>
                        <Footer>Footer</Footer>
                    </Layout>
                </Layout>
                <br/>
                <Layout>
                    <Header>Header</Header>
                    <Main>Main</Main>
                </Layout>
                <div class="q-title">代码示例：</div>
            </div>
            
            <div class="wrap custom-demo">
                <div class="q-title">上中下：</div>
                <Layout class="layout">
                    <Header>
                        <Menu direction="horizontal" current="1">
                            <div class="logo">VSUITE</div>
                            <div class="nav">
                                <MenuItem name="1">item1</MenuItem>
                                <MenuItem name="2">item2</MenuItem>
                                <MenuItem name="3">item3</MenuItem>
                                <MenuItem name="4">item4</MenuItem>
                            </div>
                        </Menu>
                    </Header>
                    <Main>
                        <Bread :style="{margin: '20px 0'}">
                            <BreadItem>主页</BreadItem>
                            <BreadItem>组件</BreadItem>
                            <BreadItem>资源</BreadItem>
                        </Bread>
                        <Card>
                            <div style="min-height: 200px;">
                                Main
                            </div>
                        </Card>
                    </Main>
                    <Footer>2017-2018 &copy; vsuite</Footer>
                </Layout>
                <div class="q-title">上左下：</div>
                <Layout class="layout">
                    <Header>
                        <Menu direction="horizontal" current="1">
                            <div class="logo">VSUITE</div>
                            <div class="nav">
                                <MenuItem name="1">item1</MenuItem>
                                <MenuItem name="2">item2</MenuItem>
                                <MenuItem name="3">item3</MenuItem>
                                <MenuItem name="4">item4</MenuItem>
                            </div>
                        </Menu>
                    </Header>
                    <Layout>
                        <Sider hide-trigger>
                            <Menu current="overview/real" :openeds="['overview']">
                                <SubMenu name="overview">
                                    <template slot="title">
                                        <Icon type="android-list"></Icon>基本概况
                                    </template>
                                    <MenuItem name="overview/real">实时数据</MenuItem>
                                    <MenuItem name="overview/key">关键数据</MenuItem>
                                    <MenuItem name="overview/version">版本分布</MenuItem>
                                </SubMenu>
                                <SubMenu name="user">
                                    <template slot="title">
                                        <Icon type="android-desktop"></Icon>用户分析
                                    </template>
                                    <MenuItem name="user/active">活跃度</MenuItem>
                                    <MenuItem name="user/stay">用户留存</MenuItem>
                                    <MenuItem name="user/leave">用户流失</MenuItem>
                                </SubMenu>
                                <SubMenu name="admin">
                                    <template slot="title">
                                        <Icon type="android-people"></Icon>用户管理
                                    </template>
                                    <MenuItem name="admin/account">账号设置</MenuItem>
                                    <MenuItem name="admin/list">账号列表</MenuItem>
                                </SubMenu>
                                <SubMenu name="set">
                                    <template slot="title">
                                        <Icon type="android-options"></Icon>综合设置
                                    </template>
                                    <MenuItem name="set/version">版本管理</MenuItem>
                                    <MenuItem name="set/channel">渠道管理</MenuItem>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Main>
                            <Bread :style="{margin: '20px 0'}">
                                <BreadItem>主页</BreadItem>
                                <BreadItem>组件</BreadItem>
                                <BreadItem>资源</BreadItem>
                            </Bread>
                            <Card>
                                <div style="min-height: 200px;">
                                    Main
                                </div>
                            </Card>
                        </Main>
                    </Layout>
                </Layout>
                <div class="q-title">代码示例：</div>
            </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {}
};
</script>
<style lang="scss">
.base-demo{
    .vsu-layout{
        .vsu-header{
            text-align:center;
            background: #4b61d9;
            color: #fff;
            padding: 0 50px;
            height: 64px;
            line-height: 64px;
        }
        .vsu-main{
            color: #fff;
            text-align:center;
            background: #8697f6;
            min-height: 120px;
            line-height: 120px;
        }
        .vsu-footer{
            text-align:center;
            padding: 24px 50px;
            font-size: 14px;
            background: #4b61d9;
            color: #fff;
        }
        .vsu-sider{
            text-align:center;
            padding: 24px 50px;
            font-size: 14px;
            background: #3e57de;
            color: #fff;
        }

    }
}
.custom-demo{
    .vsu-layout{
        background-color: #EFEFEF;
        border: 1px solid #efefef;
        .vsu-header{
            background: #4b61d9;
            padding: 0 50px;
            height: 64px;
            line-height: 64px;
            .logo{
                color:#fff;
                float: left;
            }
            .nav{
                width: 420px;
                float: right;
                .vsu-menu-item{
                    color:#fff;
                }
            }
        }
        .vsu-main{
            padding: 0px 50px 40px;
            .vsu-card{
                background: #fff;
                border-radius: 4px;
                font-size: 14px;
                position: relative;
                transition: all .2s ease-in-out;
                width:100%;
                border: 1px solid #dddee1;
                border-color: #e9eaec;
                &:hover{
                    box-shadow: 0 1px 6px rgba(0,0,0,.2);
                    border-color: #eee;
                }
            }
        }
        .vsu-footer{
            text-align: center;
            padding: 24px 50px;
            color: #495060;
            font-size: 14px;
        }
        .vsu-sider{
            background: #fff;
        }

    }
    
}
</style>
