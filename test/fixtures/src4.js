for (let i = 0; i < 5; i++) {
    const j = i;
    setTimeout(function () {
        this.a = j;
    });
}
