<div class="hero-container">
    <div class="hero-left">
        <div class="hero-text">
            <p>Hi, my name is</p>
            <p>Altuğ Alpcan Yaşar</p>
            <p>A passionate developer</p>
        </div>
    </div>
    <div class="hero-right">
        as
    </div>
</div>

<style>
    .hero-container {
        display: flex;
        margin: 0 var(--general-margin);
    }

    .hero-left {
        /* background-color: rgb(24, 23, 22); */
        flex: 1;
    }

    .hero-right {
        background-color: rgb(118, 96, 66);
        flex: 1;
    }

    .hero-text {
        display: flex;
        flex-direction: column;
        color: var(--text-color);
        font-family: var(--hero-font);
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    .hero-text p {
        margin: 0;
    }

    .hero-text p:nth-child(1) {

    }

    .hero-text p:nth-child(2) {
        color: var(--main-color);
        font-size: 54px;
    }

    .hero-text p:nth-child(3) {
        align-self: center;
    }

</style>