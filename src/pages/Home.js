import React from 'react';
import Header from '../components/Header';
import HomeSection from '../components/HomeSection';
import ResponsivePageSwitcher from '../components/ResponsivePageSwitcher';

const textData = require("../data/homeText.json")

const Home = () => {

    return (
        <div className='home'>
            <Header />
            <main className='home-main'>
                <div className='main-container'>
                    <h1 className='title'>Fauna Project</h1>
                    {
                        textData.map((value, index) => (
                            <HomeSection>
                                <h2 className='section-title'>{index + 1}.&emsp;{value.title}</h2>
                                <p className='section-content'>{value.content}</p>
                            </HomeSection>
                        ))
                    }
                </div>
            </main>
            <footer></footer>
            <ResponsivePageSwitcher />
        </div>
    );
};

export default Home;