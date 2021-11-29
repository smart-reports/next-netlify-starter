import styled, { css } from 'styled-components'
import { BGColor, SEGColor } from '../../public/colors'
import { FadeInLeft, SlideInLeft } from '../animations'
export const Content = styled.div`
    padding: 40px;
    width: 100%;
    overflow: hidden;
    @media only screen and (max-width: 960px){
        padding: 20px;
    }
`
export const ContentSearch = styled.div`
    padding-top: 50px;
    padding-bottom: 100px;
    display: flex;
    flex: 0 0 100%;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 1024px;
    margin: 0 auto;
    @media only screen and (max-width: 960px){
        padding-bottom: 50px;
    }
`
export const Menu = styled.div`
    position: absolute;
    top: 100%;
    z-index: 4;
    left: 0;
    width: 200px;
  width: 320px;
  height: 300px;
  background-color: ${BGColor};
  padding: 20px;
  transform-origin: 200% 50%;
  transition: .2s ease;
  z-index: 999 !important;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  transform-origin: top left;
    ${({ showMenu }) => showMenu
        ? css`
        opacity: 1;
        transform: scale(1);
        transition-delay: 200ms;
        transition-duration: 200ms;
        display: block;
        `
        : css`
        transition: 0.1s opacity cubic-bezier(0.39, 0.575, 0.565, 1),0.55s transform cubic-bezier(0.1, 1.26, 0.83, 1);
        opacity: 0;
        transform: scale(0);
        transform-origin: 10% top;
          `}
`

export const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
    gap: 2rem;
    padding: 0;
    list-style-type: none;
    max-width: 1024px;
    margin: 0 auto;
`
export const Option = styled.button`
    cursor: pointer;
    border-radius: 10px;
    width: 100%;
    display: flex;
    background-color: #fff;
    padding: 15px 0px;
    &:hover {
        background-color: #f8f8fa;
    }
`
export const SearchFilterOption = styled.div`
    opacity: 0;
    transform: scale(0);
    transform-origin: 10% top;
    transition: 0.1s opacity cubic-bezier(0.39, 0.575, 0.565, 1),0.55s transform cubic-bezier(0.1, 1.26, 0.83, 1);
    position: absolute;
    top: 100%;
    z-index: 4;
    margin-top: 5px;
    left: 0;
    width: 200px;
    padding: 2px;
    background-color: ${BGColor};
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.04);
`
export const Button = styled.button`
    padding: 0 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-size: 16px;
    background-color: transparent;
    &:hover ${SearchFilterOption} {
        opacity: 1;
        transform: scale(1);
        transition-delay: 200ms;
        transition-duration: 200ms;
        display: block;
    }
`
export const CtnSearch = styled.div`
top: 0;
    left: 0;
    right: 0;
    margin: 0;
    display: flex;
    align-items: center;
    border: 1px solid ${SEGColor};
    opacity: 1;
    transition: opacity ease-in-out 300ms;
    visibility: visible;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.04);
    position: relative;
    border-radius: 5px;
    height: 56px;
`
export const Logo = styled.div`
    border-radius: 50%;
    min-height: 35px;
    max-height: 35px;
    max-width: 35px;
    position: relative;
    display: grid;
    place-content: center;
    align-items: center;
    color: ${BGColor};
    font-size: 20px;
    min-width: 35px;
    background-color: rgb(0,151,230);
`
export const Text = styled.span` 
    font-size: ${({ size }) => size || '20px'};
    text-align: ${({ align }) => align || 'start'};
    /* color: ${SEGColor}; */
    color: ${({ color }) => color || SEGColor};
    margin: ${({ margin }) => margin || 'auto'};
    width: 100%;
    display: block;
    letter-spacing: -0.02em;
    font-family: ${({ font }) => font || 'PFont-Light'};
    word-break: break-word;
    ${props => props.animation && css`
    animation-name: ${FadeInLeft} ;
    margin-bottom: 0;
    animation-delay: 1s;
    `}
`
export const ContainerFooter = styled.div`
    position: absolute;
    display: flex;
    padding: 1em;
    border-radius: calc(40 * 1px) 0 0 0;
    transform: translateY(100%);
    transition: .2s ease-in-out;
    box-shadow: rgb(50 50 93 / 7%) -18px -6px 20px -1px;
    bottom: 100px;
    height: 200px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
`
export const CardEntry = styled.div`
    ${({ active }) => active && css`
        animation: ${SlideInLeft} 1s linear forwards;
        `
    }
    height: 20px;
`
export const ButtonStatus = styled.button`
    background-color:#20c0f3;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: PFont-Regular;
    color: ${BGColor};
    margin-bottom: 10px;
    padding:10px 15px;
    font-weight: 600;
    font-size: ${({ fSize }) => fSize || '13px'};
    min-width: 120px;
    width: 150px;
    margin: 50px auto;
    display: flex;
    place-content: center;
    border-radius: 50px;
`
export const Card = styled.div`
    padding: 1em;
    cursor: pointer;
    border-radius: 20px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    background: ${BGColor};
    transition: 0.2s;
    width: 100%;
    height: auto;
    overflow: hidden;
    height: 300px;
    transition: .2s ease-in-out;
    transform: translateY(0%);
    &:hover ${ContainerFooter} {
        /* transform: scale(1.3); */
        
    transform: translateY(80%);
    }
`
export const Input = styled.input`
    outline: none;
    border: .5px solid ${`${SEGColor}87`};
    padding: 15px;
    margin: 15px 0;
`
export const Form = styled.form`
    position: absolute;
    grid-gap: 0 10px;
    max-width: 250px;
    min-width: 250px;
    width: 250px;
    overflow: hidden;
    box-shadow: -1px 2px 8px 2px #dcdcdce6;
    display: grid;
    transition: all 200ms ease-in-out;
    background-color: ${BGColor};
    padding: 10px;
    left: 15pc;
    top: -40px;
    width: 500px;
    z-index: 999;
${({ show }) => show
        ? css`
              visibility: visible;
              opacity: 1;
              transform: translateY(0);
          `
        : css`
            
              margin: 0;
              visibility: hidden;
              opacity: 0;
              transform: translateY(-50px);
          `}
`
export const Overline = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: transparent;
    ${props => props.show ? css`display: block` : css`display: none;`};
    @media only screen and (min-width: 960px){
    }
  
`
