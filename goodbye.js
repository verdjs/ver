(function () {
    var style = document.createElement("style");
    style.textContent = "body > *:not(#goodbye-overlay){display:none!important}";
    document.head.appendChild(style);

    document.addEventListener("DOMContentLoaded", function () {
        document.body.style.cssText = "margin:0;padding:0;background:#fff;";
        var overlay = document.createElement("div");
        overlay.id = "goodbye-overlay";
        overlay.setAttribute("role", "main");
        overlay.setAttribute("aria-live", "assertive");
        overlay.style.cssText = "padding:40px;";
        overlay.innerHTML =
            "<p style='margin:0 0 8px 0;'>goodbye</p>" +
            "<p style='margin:0 0 8px 0;'>ts costs too much</p>" +
            "<p style='margin:0;'>no i will not be adding ads they don't give like any $$$ and no you cannot pay me</p>";
        document.body.appendChild(overlay);
    });
}());

