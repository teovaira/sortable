// randomly offset the position of the pop-up word
function randomOffset(amount) {
    return Math.floor(Math.random() * amount * 2) - amount
}

// Spawns a comic-style pop-up word at (x, y) coordinates. The word disappears after 700ms.
export function spawnComicWord(x, y) {
    const el = document.createElement("div")
    el.className = "hit-word"
    const words = ["POW!", "BAM!", "ZAP!", "BOOM!", "WHAM!"]
    const randomWord = words[Math.floor(Math.random() * words.length)]
    el.textContent = randomWord

    const randomX = x + randomOffset(80)
    const randomY = y + randomOffset(50)

    el.style.left = `${randomX}px`
    el.style.top = `${randomY}px`

    document.body.appendChild(el)

    setTimeout(() => {
        el.remove()
    }, 700)
}

// Listen for clicks on the document and spawn a comic word at the click location, unless the click is on an input, select, button, or textarea element.
document.addEventListener("click", event => {
    const ignored = event.target.closest("input, select, button, textarea")

    if (ignored) return

    spawnComicWord(event.clientX, event.clientY)
})