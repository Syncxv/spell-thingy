import styled from "@emotion/styled";


export const Item = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.875rem/* 30px */;
    line-height: 2.25rem/* 36px */;
    height: 100%;
    width: 100%;
    aspect-ratio: 1/1;
    color: #1b1b1b;
    background-color: #e2e2e2;
    padding: 1rem;
    user-select: none;
    border-radius: 0.2rem;
    transition: background-color .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &.selected {
        background-color: #3232cf;
        color: #dfdfdf;
    }
`;



