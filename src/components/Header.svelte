<header>
    <a href="/" class="home-link">Home</a>
    <div class="header-link-container">
        <a href="/projects" class="header-link">Projects</a>
        <a href="/games" class="header-link">Games</a>
        <a href="/contact" class="header-link">Contact</a>
    </div>
</header>

<style>
    header {
        background-color: rgba(0, 0, 0, 0.3);
        margin: 0;
        padding: 0 var(--general-margin);
        height: 60px;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-link-container {
        display: inline-flex;
        justify-content: flex-end;
        align-items: flex-start;
        gap: 64px;
    }

    .header-link {
        color: var(--text-color);
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-decoration: none;
    }

    .home-link {
        color: var(--text-color);
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-decoration: none;
    }

</style>