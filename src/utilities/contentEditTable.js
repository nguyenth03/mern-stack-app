
// onKeyDown
export const saveContenAfterPressEnter = (e) => {
    if(e.key === 'Enter'){
        e.target.prventDefault()
        e.target.blur()
    }
}

// select All input value when click
export const selectAllInlineText = (e) => {
    e.target.focus()
    e.target.select()
    // document.execCommand('selectAll', false, null)
}