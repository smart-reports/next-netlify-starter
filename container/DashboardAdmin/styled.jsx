import styled from 'styled-components'
import { BGColor } from '../../public/colors'

export const Container = styled.div`
    width: 100%;
    overflow: hidden;
    background-color: ${BGColor};
    position: relative;
    height: 100vh;
`
export const ContainerCard = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(33%, 1fr));
    padding: 0;
    margin: 0 auto;
`
export const Card = styled.div`
    width: 50%;
    transition: 400ms ease;
    height: auto;
    max-width: 100%;
    padding: 10px;
    border-radius: 5px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    background: ${BGColor};
    &:hover {
        box-shadow: rgba(18, 18, 19, 0.2) 0px 7px 29px 0px;
    }
`
