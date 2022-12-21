class Logger {

    public log(...message: any[]) {
        console.log(this.getDate(), message.join(" "));
    }

    public warn(...message: any[]) {
        console.warn(this.getDate(), message.join(" "));
    }

    public error(...message: any[]) {
        console.error(this.getDate(), message.join(" "));
    }

    private getDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth()+1).toString().length < 2 ? `0${date.getMonth()+1}` : date.getMonth()+1;
        const day = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDate();
        const hour = date.getHours().toString().length < 2 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes().toString().length < 2 ? `0${date.getMinutes()}` : date.getMinutes();
        const seconds = date.getSeconds().toString().length < 2 ? `0${date.getSeconds()}` : date.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}   `
    }
}

export default new Logger();
