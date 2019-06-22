import vMinMax from "./components/v-min-max.vue";

const data = {
    triggers: { bits: true },
    settings: {
        donation: { min: 0, max: 0 },
        bits: { min: 0, max: 0 }
    }
}

const methods = {
    save: function () {
        postConfig({
            triggers: this.triggers,
            settings: this.settings
        }).then(function (result) {
            console.log(result);
        });
    }
}

const created = function () {

    console.log("boot");
    getConfig().then((data) => {
        console.log(data);
        this.settings = data.settings;
        this.triggers = data.triggers;
    });
}

const postConfig = async function (data) {

    const response = await fetch("/api/config", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json;
}

const getConfig = async function () {

    const response = await fetch("/api/config");
    const json = await response.json();
    return json;
}

export default {
    name: "app",
    components: {
        vMinMax
    },
    data() {
        return data;
    },
    methods,
    created
};