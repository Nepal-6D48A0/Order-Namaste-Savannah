import React from 'react';
import { Result } from 'antd';
import { UpCircleTwoTone } from '@ant-design/icons';

import Category from '../Category';
import Menu from '../Menu';
import MenuPlaceholder from '../Menu/MenuItem/placeholder';

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loading: true
        }

        this.changeCategory = this.changeCategory.bind(this);
    }

    componentDidMount() {
        fetch('https://namaste-savannah.com/api/menu/items/all')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    menuItems: data, 
                    categories: this.getAllCategories(data),
                    loading: false
                });
            })
            .catch(err => this.setState({ error: true }));
    }

    changeCategory(newCategory) {
        if (newCategory === this.state.activeCategory) {
            return;
        }

        this.setState({ activeCategory: newCategory });
    }

    getAllCategories(menuItems) {
        if (!menuItems) {
            return [];
        }
        let allCategories = menuItems.map(item => item.category);
        return allCategories.filter((value, index, self) => self.indexOf(value) === index).sort();
    }

    render() {
        if (this.state.error) {
            return <Result status="500" title="Opps!"
                subTitle="Sorry something went wrong. Please try again later" />
        }

        let contents;
        if (this.state.activeCategory) {
            let items = this.state.menuItems.filter(item => item.category === this.state.activeCategory);
            contents = <Menu menuItems={items} loading={false} />;
        } else if (this.state.loading) {
            contents = (
                <div className="row" style={{ width: '100%' }}>
                    <div className="col-12 col-md-6"><MenuPlaceholder /></div>
                    <div className="col-12 col-md-6"><MenuPlaceholder /></div>
                </div>
            );
        } else {
            contents = <Result
                icon={<UpCircleTwoTone />}
                title="Please select a category to begin"
            />;
        }

        return (
            <>
                <Category loading={this.state.loading} categories={this.state.categories}
                    changeCategory={this.changeCategory} activeCategory={this.state.activeCategory}
                />
                <div className="my-4 py-5 container">
                    {contents}
                </div>
            </>
        )

    }

}

export default MainContainer;