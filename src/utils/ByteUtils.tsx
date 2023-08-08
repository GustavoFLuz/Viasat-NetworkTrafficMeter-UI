export function ByteToNumber(byte: string): number {
    const byteNumber = parseFloat(byte.replaceAll(/[A-Z]/g, ""))
    const byteLetter = byte.replaceAll(/[0-9]|\./g, "") + ""

    const lettersToQuantities = (suffix: string) => {
        if (suffix.includes('s'))
            suffix = suffix.replace('/s', '')
        return {
            "B": 1,
            "KB": 1000,
            "MB": 1000000,
            "GB": 1000000000,
            "TB": 1000000000000,
        }[suffix]
    }

    const byteValue = byteNumber * (lettersToQuantities(byteLetter) || 1)
    return byteValue
}

export function NumberToByte(number: number): string {
    if (number < 1e3) {
        return number.toFixed(2) + "B"
    }
    if (number < 1e6) {
        return (number / 1e3).toFixed(2) + "KB"
    }
    if (number < 1e9) {
        return (number / 1e6).toFixed(2) + "MB"
    }
    if (number < 1e12) {
        return (number / 1e9).toFixed(2) + "GB"
    }
    return (number / 1e12).toFixed(2) + "TB"
}