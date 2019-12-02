export class RouteResolver<T> {
    routes : { test: RegExp, data: T }[] = [];
    addRoute(test : RegExp, data: T) {
        this.routes.push({test, data });
    }
    resolveRoute(location: Location) {
        for (var i = 0; i < this.routes.length; i += 1) {
            const m = location.pathname.match(this.routes[i].test);
            if (m && m[0]) {
                return { data: this.routes[i].data, args: m.slice(1) };
            }
        }
        return null;
    }
}