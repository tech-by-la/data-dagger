import type {LayoutServerLoad} from "./$types";


export const load: LayoutServerLoad = ({ locals }) => {
    const colors = {
        purpleLight:'#798AC5',
        putpleMedium: '#43448d',
        putpleMediumTransparent: '#43448d80',
        purpleDark: '#282158',

        blueLight:'#79b6c5',
        blueMedium: '#43668d',
        blueMediumTransparent: '#43668d80',
        blueDark: '#214d58',

        greenLight:'#79c58c',
        greenLightTransparent:'#79c58c80',
        greenMedium: '#438d47',
        greenMediumTransparent: '#438d4780',
        greenDark: '#1a4d1f',

        yellowLight:'#c0c579',
        yellowMedium: '#828d43',
        yellowMediumTransparent: '#828d4380',
        yellowDark: '#545821',

        redLight:'#c57979',
        redMedium: '#8d4343',
        redMediumTransparent: '#8d434380',
        redDark: '#582121',

        orangeLight:'#c5a279',
        orangeMedium: '#8d6a43',
        orangeMediumTransparent: '#8d6a4380',
        orangeDark: '#583c21',
    }

    return {
        user: locals.user,
        colors: colors,
    }
}
