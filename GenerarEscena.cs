using UnityEngine;

public class GenerarEscena : MonoBehaviour
{
    public int numeroCubos = 12;
    public float radio = 8f;
    public Vector3 escalaCubos = new Vector3(2,5,2);

    void Start()
    {
        CrearPiso();
        CrearCubosEnSemicirculo();
        CrearEsfera();
    }

    void CrearPiso()
    {
        GameObject piso = GameObject.CreatePrimitive(PrimitiveType.Plane);
        piso.transform.localScale = new Vector3(5,1,5);
        piso.transform.position = new Vector3(0,0,0);
    }

    void CrearCubosEnSemicirculo()
    {
        float anguloInicio = -90f;
        float anguloFin = 90f;

        for(int i = 0; i < numeroCubos; i++)
        {
            float angulo = Mathf.Lerp(anguloInicio, anguloFin, (float)i/(numeroCubos-1));
            float rad = angulo * Mathf.Deg2Rad;

            float x = Mathf.Cos(rad) * radio;
            float z = Mathf.Sin(rad) * radio;

            GameObject cubo = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cubo.transform.position = new Vector3(x, escalaCubos.y/2, z);
            cubo.transform.localScale = escalaCubos;

            cubo.transform.LookAt(Vector3.zero);
        }
    }

    void CrearEsfera()
    {
        GameObject esfera = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        esfera.transform.position = new Vector3(0,1,0);
    }
}