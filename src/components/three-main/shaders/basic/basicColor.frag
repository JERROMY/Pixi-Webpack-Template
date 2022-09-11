precision mediump float;

varying vec2 vUv;
#define PI 3.1415926535897932384626433832795

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
    // float strengthX = vUv.x;
    
    // strengthY = strengthY < 0.5 ? 0.0 : 1.0;

    // float strength = step(0.8, mod( vUv.x * 10.0, 1.0 )); // < 0.5 = 0, > 0.5 = 1
    // strength += step(0.8, mod( vUv.y * 10.0, 1.0 ));

    // float strength = step(0.8, mod( vUv.x * 10.0, 1.0 )); // < 0.5 = 0, > 0.5 = 1
    // strength *= step(0.8, mod( vUv.y * 10.0, 1.0 ));

    // float barX = step(0.4, mod( vUv.x * 10.0, 1.0 )); // < 0.5 = 0, > 0.5 = 1
    // barX *= step(0.8, mod( vUv.y * 10.0 + 0.2, 1.0 ));
    
    // float barY = step(0.8, mod( vUv.x * 10.0 + 0.2, 1.0 )); // < 0.5 = 0, > 0.5 = 1
    // barY *= step(0.4, mod( vUv.y * 10.0, 1.0 ));
    // float strength = barX + barY;


    

    // vec3 c1 = vec3(strength, strength, strength);
    // vec3 c2 = vec3(strength2, strength2, strength2);
    // vec3 c3 = c1 + c2;

    //float strength = abs(vUv.x - 0.5);
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //strength *= abs(vUv.x - 0.5);

    // if( strengthY < 0.5 ){
    //     strengthY = 0.0;
    // }else{
    //     strengthY = 1.0;
    // }

    // float sq1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) );
    // float sq2 = 1.0 - step( 0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) ) ;
    // float strength = sq1 * sq2;

    // float strength = floor( vUv.x * 10.0 ) / 10.0;
    // strength *= floor( vUv.y * 10.0 ) / 10.0;

    // float strength = floor( vUv.x * 10.0 ) / 10.0;
    // strength *= floor( vUv.y * 10.0 ) / 10.0;

    
    // vec2 gridUV = vec2( 
    //     floor( vUv.x * 10.0 ) / 10.0, 
    //     floor( vUv.y * 10.0 ) / 10.0 
    //     );
    // float strength = random( gridUV );

    // vec2 gridUV = vec2( 
    //     floor( vUv.x * 10.0 ) / 10.0, 
    //     floor( ( vUv.y + vUv.x * 0.5 ) * 10.0 ) / 10.0 
    // );

    // float strength = random( gridUV );

    //float strength = sqrt( vUv.x * vUv.x + vUv.y * vUv.y );
    //float strength = length( vUv - 0.5 );
    //float strength = 1.0 - distance( vUv, vec2( 0.5 ) );

    //vec2 nuv = vUv;
    //nuv.y *= 0.5;

    // vec2 newUV = vUv;
    // newUV.x *= 0.1;

    // vec2 lightUv = vec2 (
    //     vUv.x * 0.1 + 0.45, 
    //     vUv.y * 0.5 + 0.25
    //     );

    // float strength = .015 / distance( lightUv, vec2( 0.5 ) );

    // vec2 lightUvX = vec2 (
    //     vUv.x * 0.1 + 0.45, 
    //     vUv.y * 0.5 + 0.25
    // );

    // float lightX = 0.015 / distance( lightUvX, vec2( 0.5 ) );

    // vec2 lightUvY = vec2 (
    //     vUv.y * 0.1 + 0.45, 
    //     vUv.x * 0.5 + 0.25
    // );

    // float lightY = 0.015 / distance( lightUvY, vec2( 0.5 ) );

    //vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    //float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    //strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

    //float lightY = 0.015 / distance( lightUvY, vec2( 0.5 ) );
    //float strength = lightX + lightY;

    //float strength = step(0.25 ,distance(vUv, vec2(0.5)));

    //float strength = step(0.01, abs( distance(vUv, vec2(0.5)) - 0.25 ));
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs( distance(wavedUv, vec2(0.5)) - 0.25 ));

    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs( distance(wavedUv, vec2(0.5)) - 0.25 ));

    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs( distance(wavedUv, vec2(0.5)) - 0.25 ));

    vec2 wavedUv = vec2(
        vUv.x + sin(vUv.y * 100.0) * 0.1,
        vUv.y + sin(vUv.x * 100.0) * 0.1
    );
    float strength = 1.0 - step(0.01, abs( distance(wavedUv, vec2(0.5)) - 0.25 ));
    

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}