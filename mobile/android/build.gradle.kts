allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}

subprojects {
    afterEvaluate {
        val plugin = project.plugins.findPlugin("com.android.library")
        if (plugin != null) {
            val androidExt = project.extensions.findByName("android")
            if (androidExt != null) {
                try {
                    val compileSdkMethod = androidExt.javaClass.getMethod("setCompileSdkVersion", Int::class.java)
                    compileSdkMethod.invoke(androidExt, 34)
                } catch (e: Exception) {
                    // Ignore if method not found
                }
            }
        }
    }
}
